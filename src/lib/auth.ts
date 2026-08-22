import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isLocked, recordFailedAttempt, clearAttempts } from "@/lib/login-protection";

const providers = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

providers.push(
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const email = (credentials.email as string).toLowerCase().trim();
      const lockStatus = isLocked(email);
      if (lockStatus.locked) {
        const minutes = Math.ceil((lockStatus.retryAfterMs || 0) / 60000);
        throw new Error(`Account locked. Try again in ${minutes} minute${minutes > 1 ? "s" : ""}.`);
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.password) {
        recordFailedAttempt(email);
        return null;
      }

      const valid = await compare(credentials.password as string, user.password);
      if (!valid) {
        const result = recordFailedAttempt(email);
        if (result.locked) {
          throw new Error("Account locked due to too many failed attempts. Try again in 15 minutes.");
        }
        return null;
      }

      clearAttempts(email);
      return { id: user.id, name: user.name, email: user.email, role: (user as { role?: string }).role };
    },
  })
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.role = (user as { role?: string }).role || "USER";
      }
      if (trigger === "update" && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: { role: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { id?: string }).id = token.sub as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});

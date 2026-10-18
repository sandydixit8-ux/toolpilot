import Link from "next/link";
import { AUTHOR } from "@/config/author";
import { BadgeCheck } from "lucide-react";

export function AuthorBio({ reviewedAt }: { reviewedAt?: Date | null }) {
  return (
    <aside className="mt-12 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/40">
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-violet-600 text-sm font-bold text-white"
        >
          {AUTHOR.initials}
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
            {AUTHOR.name}
            <BadgeCheck className="h-4 w-4 text-blue-500" aria-label="Verified author" />
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{AUTHOR.role}</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{AUTHOR.shortBio}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            <Link href={AUTHOR.path} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
              About the author
            </Link>
            <Link href="/editorial-policy" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
              Editorial policy
            </Link>
            {reviewedAt && (
              <span>
                Last reviewed:{" "}
                <time dateTime={reviewedAt.toISOString()}>
                  {reviewedAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </time>
              </span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

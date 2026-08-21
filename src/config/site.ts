import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";

export const siteConfig = {
  name: SITE_NAME,
  tagline: SITE_TAGLINE,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  ogImage: `${SITE_URL}/og.png`,
  links: {
    twitter: "https://twitter.com/toolpilot",
    github: "https://github.com/toolpilot",
  },
};

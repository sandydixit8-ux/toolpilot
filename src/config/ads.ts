import { ADS_ENABLED, ADSENSE_PUBLISHER_ID } from "@/lib/constants";

// Ad unit registration. Current slot IDs are PLACEHOLDERS — AdSense serves
// nothing until they are replaced with real "ad unit" IDs from your approved
// AdSense console (Ads → By ad unit, e.g. 1234567890). Anchor ad stays off
// until NEXT_PUBLIC_ANCHOR_AD_SLOT is set in the environment.
export const ADS = {
  home: {
    topBanner: "0000000001",
    midArticle: "0000000008",
    bottomBanner: "0000000009",
  },
  blogList: "0000000010",
  blogPost: {
    afterContent: "0000000007",
    beforeCta: "0000000004",
  },
  toolsList: "0000000011",
  toolCategory: {
    banner: "0000000005",
    inArticle: "0000000006",
  },
  toolDetail: {
    inArticle: "0000000002",
    sidebar: "0000000003",
  },
  anchor: process.env.NEXT_PUBLIC_ANCHOR_AD_SLOT || "",
} as const;

export { ADS_ENABLED, ADSENSE_PUBLISHER_ID };
import { ADS_ENABLED, ADSENSE_PUBLISHER_ID } from "@/lib/constants";

// Ad unit registration. Current slot IDs are PLACEHOLDERS — AdSense serves
// nothing until they are replaced with real "ad unit" IDs from your approved
// AdSense console (Ads → By ad unit, e.g. 1234567890). Anchor ad stays off
// until NEXT_PUBLIC_ANCHOR_AD_SLOT is set in the environment.
export const ADS = {
  home: {
    topBanner: "1500194516",
    midArticle: "1500194516",
    bottomBanner: "1500194516",
  },
  blogList: "1500194516",
  blogPost: {
    afterContent: "1500194516",
    beforeCta: "1500194516",
  },
  toolsList: "1500194516",
  toolCategory: {
    banner: "1500194516",
    inArticle: "1500194516",
  },
  toolDetail: {
    inArticle: "1500194516",
    sidebar: "1500194516",
  },
  anchor: process.env.NEXT_PUBLIC_ANCHOR_AD_SLOT || "",
} as const;

export { ADS_ENABLED, ADSENSE_PUBLISHER_ID };
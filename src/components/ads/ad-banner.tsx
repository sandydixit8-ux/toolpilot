import { AdUnit } from "./ad-unit";

const ADSENSE_PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

export function BannerAd({ slotId, className }: { slotId: string; className?: string }) {
  if (!ADS_ENABLED || !ADSENSE_PUBLISHER_ID) return null;
  return <AdUnit slotId={slotId} format="horizontal" className={className} />;
}

export function InArticleAd({ slotId, className }: { slotId: string; className?: string }) {
  if (!ADS_ENABLED || !ADSENSE_PUBLISHER_ID) return null;
  return (
    <div className={`my-8 ${className || ""}`}>
      <p className="text-center text-xs text-gray-400 dark:text-gray-600 mb-2">Advertisement</p>
      <AdUnit slotId={slotId} format="fluid" />
    </div>
  );
}

export function SidebarAd({ slotId, className }: { slotId: string; className?: string }) {
  if (!ADS_ENABLED || !ADSENSE_PUBLISHER_ID) return null;
  return (
    <div className={`sticky top-24 ${className || ""}`}>
      <p className="text-center text-xs text-gray-400 dark:text-gray-600 mb-2">Advertisement</p>
      <AdUnit slotId={slotId} format="auto" responsive />
    </div>
  );
}

export function AnchorAd({ slotId }: { slotId: string }) {
  if (!ADS_ENABLED || !ADSENSE_PUBLISHER_ID) return null;
  return <AdUnit slotId={slotId} format="anchor" responsive={false} />;
}

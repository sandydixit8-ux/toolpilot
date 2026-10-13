import { pickTool, planShort } from "./content";
import { generateShort } from "./generate";
import { hasCredentials, uploadShort } from "./upload";

function argValue(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1) : undefined;
}

(async () => {
  const dryRun = process.argv.includes("--dry-run");
  const offset = Number(argValue("--day-offset") || 0) || 0;

  const tool = pickTool(offset);
  const plan = planShort(tool);
  console.log(`[shorts] tool=${tool.slug} steps=${plan.slides.steps.length}`);

  const { video, duration } = await generateShort(plan);
  console.log(`[shorts] generated ${video} (${duration.toFixed(1)}s)`);

  if (dryRun) {
    console.log("[shorts] dry-run: skipping upload");
    return;
  }
  if (!hasCredentials()) {
    console.warn("[shorts] YT_CLIENT_ID / YT_CLIENT_SECRET / YT_REFRESH_TOKEN missing - skipping upload");
    return;
  }

  const id = await uploadShort(video, plan, process.env.YT_PRIVACY || "public");
  console.log(`[shorts] uploaded id=${id} https://youtu.be/${id}`);
})().catch((e: Error) => {
  console.error("[shorts]", e.message);
  process.exit(1);
});

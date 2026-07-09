import { isTauriRuntime } from "./platform";
import {
  webCountDashboardMetrics,
  webListJobs,
  webReadSettingsMap
} from "./webStore";

export async function readSettingsMap() {
  if (!isTauriRuntime()) return webReadSettingsMap();

  const { asc } = await import("drizzle-orm");
  const { db } = await import("./drizzle/client");
  const { appSettings } = await import("./drizzle/schema");
  const records = await db.select().from(appSettings).orderBy(asc(appSettings.key));
  return Object.fromEntries(records.map((record) => [record.key, record.value]));
}

export async function listJobs(limit = 24) {
  if (!isTauriRuntime()) return webListJobs(limit);

  const { desc } = await import("drizzle-orm");
  const { db } = await import("./drizzle/client");
  const { ingestionJobs } = await import("./drizzle/schema");
  return db.select().from(ingestionJobs).orderBy(desc(ingestionJobs.createdAt)).limit(limit);
}

export async function countDashboardMetrics() {
  if (!isTauriRuntime()) return webCountDashboardMetrics();

  const { db } = await import("./drizzle/client");
  const { ingestionJobs, mediaItems } = await import("./drizzle/schema");
  const items = await db.select().from(mediaItems);
  const jobs = await db.select().from(ingestionJobs);

  return {
    totalItems: items.length,
    totalJobs: jobs.length,
    completedJobs: jobs.filter((job) => job.status === "completed").length,
    failedJobs: jobs.filter((job) => job.status === "failed").length
  };
}

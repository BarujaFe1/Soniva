import { asc, desc } from "drizzle-orm";
import { db } from "./drizzle/client";
import { appSettings, ingestionJobs, mediaItems } from "./drizzle/schema";

export async function readSettingsMap() {
  const records = await db.select().from(appSettings).orderBy(asc(appSettings.key));
  return Object.fromEntries(records.map((record) => [record.key, record.value]));
}

export async function listJobs(limit = 24) {
  return db.select().from(ingestionJobs).orderBy(desc(ingestionJobs.createdAt)).limit(limit);
}

export async function countDashboardMetrics() {
  const items = await db.select().from(mediaItems);
  const jobs = await db.select().from(ingestionJobs);

  return {
    totalItems: items.length,
    totalJobs: jobs.length,
    completedJobs: jobs.filter((job) => job.status === "completed").length,
    failedJobs: jobs.filter((job) => job.status === "failed").length
  };
}

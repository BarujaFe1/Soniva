import { describe, expect, it, beforeEach } from "vitest";
import {
  clearDemoData,
  isDemoLoaded,
  loadDemoData,
  webBootstrapApp,
  webCountDashboardMetrics,
  webListLibraryItems,
  webSaveSettings,
  webStartIngestionJob
} from "./webStore";
import {
  formatBytes,
  formatDuration,
  prettyJson,
  safeJsonParse,
  validateMetadataJson
} from "./utils";
import type { LibraryListItem } from "../types";

describe("utils", () => {
  it("formats bytes and duration", () => {
    expect(formatBytes(1536)).toBe("1.5 KB");
    expect(formatDuration(125)).toBe("2m 05s");
    expect(formatDuration(null)).toBe("—");
  });

  it("validates and pretty-prints JSON", () => {
    expect(validateMetadataJson("")).toEqual({ valid: false, error: "Metadata is empty" });
    expect(validateMetadataJson('{"ok":true}').valid).toBe(true);
    expect(safeJsonParse('{"a":1}')).toEqual({ a: 1 });
    expect(prettyJson('{"title":"x"}')).toContain('"title"');
  });
});

describe("webStore demo mode", () => {
  beforeEach(() => {
    clearDemoData();
  });

  it("starts empty and loads demo catalog", async () => {
    expect(isDemoLoaded()).toBe(false);
    const emptyMetrics = await webCountDashboardMetrics();
    expect(emptyMetrics.totalItems).toBe(0);

    loadDemoData();
    expect(isDemoLoaded()).toBe(true);

    const metrics = await webCountDashboardMetrics();
    expect(metrics.totalItems).toBeGreaterThan(0);
    expect(metrics.totalJobs).toBeGreaterThan(0);

    const ready = await webListLibraryItems("", "ready");
    expect(ready.every((item: LibraryListItem) => item.status === "ready")).toBe(true);
  });

  it("persists overwrite policy into bootstrap on settings save", async () => {
    await webSaveSettings({
      libraryRoot: "C:/Demo/Library",
      ytDlpPath: "",
      ffmpegPath: "C:/Tools/ffmpeg.exe",
      audioFormat: "mp3",
      overwritePolicy: "replace"
    });

    const bootstrap = await webBootstrapApp();
    expect(bootstrap.libraryRoot).toBe("C:/Demo/Library");
    expect(bootstrap.overwritePolicy).toBe("replace");
    expect(bootstrap.detectedFfmpegPath).toBe("C:/Tools/ffmpeg.exe");
  });

  it("requires authorization before creating a web demo job", async () => {
    await webSaveSettings({
      libraryRoot: "C:/Demo/Library",
      ytDlpPath: "",
      ffmpegPath: "C:/Tools/ffmpeg.exe",
      audioFormat: "mp3",
      overwritePolicy: "skip"
    });

    await expect(
      webStartIngestionJob({
        sourceKind: "local_file",
        inputValue: "C:/Demo/clip.mp4",
        authorized: false
      })
    ).rejects.toThrow(/autorizado/i);

    const result = await webStartIngestionJob({
      sourceKind: "local_file",
      inputValue: "C:/Demo/clip.mp4",
      authorized: true
    });
    expect(result.jobId).toMatch(/^job-web-/);

    const metrics = await webCountDashboardMetrics();
    expect(metrics.totalJobs).toBe(1);
    expect(metrics.totalItems).toBe(1);
  });
});

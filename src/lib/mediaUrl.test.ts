import { describe, expect, it } from "vitest";
import { isTauriRuntime } from "./platform";
import { toMediaUrl } from "./mediaUrl";

describe("platform + mediaUrl", () => {
  it("detects browser runtime as non-Tauri in Vitest/node", () => {
    expect(isTauriRuntime()).toBe(false);
  });

  it("returns null media URLs outside Tauri (no false asset:// claims)", async () => {
    await expect(toMediaUrl("C:/Demo/audio.mp3")).resolves.toBeNull();
    await expect(toMediaUrl(null)).resolves.toBeNull();
    await expect(toMediaUrl(undefined)).resolves.toBeNull();
  });
});

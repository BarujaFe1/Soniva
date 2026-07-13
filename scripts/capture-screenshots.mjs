import { createServer } from "node:http";
import { createReadStream, existsSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const outDir = path.join(root, "docs", "screenshots");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".json": "application/json"
};

function contentType(filePath) {
  return MIME[path.extname(filePath)] ?? "application/octet-stream";
}

async function startStaticServer() {
  if (!existsSync(path.join(dist, "index.html"))) {
    throw new Error("dist/ missing — run npm run build first");
  }

  const server = createServer((req, res) => {
    try {
      const url = new URL(req.url ?? "/", "http://127.0.0.1");
      let pathname = decodeURIComponent(url.pathname);
      if (pathname === "/") pathname = "/index.html";
      let filePath = path.join(dist, pathname.replace(/^\//, ""));
      if (!existsSync(filePath) || !path.extname(filePath)) {
        filePath = path.join(dist, "index.html");
      }
      res.writeHead(200, { "Content-Type": contentType(filePath) });
      createReadStream(filePath).pipe(res);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end(String(error));
    }
  });

  await new Promise((resolve) => server.listen(4177, "127.0.0.1", resolve));
  return server;
}

async function clickVisibleNav(page, labels) {
  for (const label of labels) {
    const locator = page.locator("button", { hasText: label });
    const count = await locator.count();
    for (let i = 0; i < count; i += 1) {
      const candidate = locator.nth(i);
      if (await candidate.isVisible()) {
        await candidate.click();
        return;
      }
    }
  }
  throw new Error(`No visible nav button for: ${labels.join(" | ")}`);
}

async function main() {
  await readFile(path.join(dist, "index.html"));
  await mkdir(outDir, { recursive: true });

  const server = await startStaticServer();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });

  try {
    await page.goto("http://127.0.0.1:4177/?demo=1", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /dados de demonstração/i }).first().click();
    await page.waitForTimeout(900);

    await page.screenshot({ path: path.join(outDir, "01-overview.png"), fullPage: false });

    await clickVisibleNav(page, ["Ingestão autorizada", "Ingestão"]);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, "02-ingest.png"), fullPage: false });

    await clickVisibleNav(page, ["Biblioteca"]);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, "03-library.png"), fullPage: false });

    await clickVisibleNav(page, ["Jobs"]);
    await page.waitForTimeout(400);
    const jobRow = page.locator("button").filter({ hasText: /Podcast|Workshop|Orquestra|Demo|demo/i }).first();
    if (await jobRow.count()) {
      await jobRow.click().catch(() => undefined);
      await page.waitForTimeout(350);
    }
    await page.screenshot({ path: path.join(outDir, "04-jobs.png"), fullPage: false });

    await clickVisibleNav(page, ["Configurações", "Ajustes"]);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, "05-settings.png"), fullPage: false });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://127.0.0.1:4177/?demo=1", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /dados de demonstração/i }).first().click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(outDir, "06-mobile-overview.png"), fullPage: false });

    console.log(`Screenshots written to ${outDir}`);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

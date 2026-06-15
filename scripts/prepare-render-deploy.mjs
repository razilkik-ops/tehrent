import fsSync from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { applySeoToHtml, buildSitemapXml, getMetaForPath } from "../lib/seo.js";

const isRender = process.env.RENDER === "true";
const root = process.cwd();
const distPath = path.join(root, "dist");
const rootIndexPath = path.join(distPath, "index.html");

async function loadEquipment() {
  const equipmentJsonPath = path.join(root, "data", "equipment.json");

  if (fsSync.existsSync(equipmentJsonPath)) {
    return JSON.parse(await fs.readFile(equipmentJsonPath, "utf8"));
  }

  const equipmentSource = await fs.readFile(path.join(root, "lib", "equipment.ts"), "utf8");
  return [...equipmentSource.matchAll(/slug:\s*"([^"]+)"/g)].map((match, index) => ({
    id: `equipment-${index}`,
    slug: match[1]
  }));
}

async function ensureRouteHtml(targetPath, html) {
  const targetDirectory = path.join(distPath, targetPath);
  await fs.mkdir(targetDirectory, { recursive: true });
  await fs.writeFile(path.join(targetDirectory, "index.html"), html, "utf8");
}

async function generateStaticRoutes() {
  const equipment = await loadEquipment();
  const baseHtml = await fs.readFile(rootIndexPath, "utf8");

  await fs.writeFile(rootIndexPath, applySeoToHtml(baseHtml, getMetaForPath("/", equipment)), "utf8");
  await ensureRouteHtml("admin", applySeoToHtml(baseHtml, getMetaForPath("/admin", equipment)));

  for (const item of equipment) {
    await ensureRouteHtml(
      path.join("equipment", item.slug),
      applySeoToHtml(baseHtml, getMetaForPath(`/equipment/${item.slug}`, equipment))
    );

    for (const legacySlug of item.legacySlugs || []) {
      await ensureRouteHtml(
        path.join("equipment", legacySlug),
        applySeoToHtml(baseHtml, getMetaForPath(`/equipment/${legacySlug}`, equipment))
      );
    }
  }

  await fs.writeFile(path.join(distPath, "sitemap.xml"), buildSitemapXml(equipment), "utf8");
}

async function copyDistToRoot() {
  const entries = await fs.readdir(distPath, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(distPath, entry.name);
    const targetPath = path.join(root, entry.name);

    if (entry.isDirectory()) {
      await fs.rm(targetPath, { recursive: true, force: true });
      await fs.cp(sourcePath, targetPath, { recursive: true });
    } else if (entry.isFile()) {
      await fs.copyFile(sourcePath, targetPath);
    }
  }
}

await generateStaticRoutes();

if (isRender) {
  await copyDistToRoot();
  console.log("Prepared Render root publish fallback.");
}

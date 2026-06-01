import fs from "node:fs/promises";
import path from "node:path";

const isRender = process.env.RENDER === "true";

if (!isRender) {
  process.exit(0);
}

const root = process.cwd();
const distPath = path.join(root, "dist");
const rootIndexPath = path.join(root, "index.html");
const distIndexPath = path.join(distPath, "index.html");
const assetsSourcePath = path.join(distPath, "assets");
const assetsTargetPath = path.join(root, "assets");

async function copyIndexToRoute(routePath) {
  const targetDirectory = path.join(root, routePath);
  await fs.mkdir(targetDirectory, { recursive: true });
  await fs.copyFile(rootIndexPath, path.join(targetDirectory, "index.html"));
}

async function equipmentSlugs() {
  const equipmentSource = await fs.readFile(path.join(root, "lib", "equipment.ts"), "utf8");
  return [...equipmentSource.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
}

await fs.copyFile(distIndexPath, rootIndexPath);
await fs.rm(assetsTargetPath, { recursive: true, force: true });
await fs.cp(assetsSourcePath, assetsTargetPath, { recursive: true });

await copyIndexToRoute("catalog");

for (const slug of await equipmentSlugs()) {
  await copyIndexToRoute(path.join("equipment", slug));
}

console.log("Prepared Render root publish fallback.");

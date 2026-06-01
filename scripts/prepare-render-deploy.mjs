import fs from "node:fs/promises";
import path from "node:path";

const isRender = process.env.RENDER === "true";

if (!isRender) {
  process.exit(0);
}

const root = process.cwd();
const distPath = path.join(root, "dist");
const rootIndexPath = path.join(root, "index.html");

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

async function copyIndexToRoute(routePath) {
  const targetDirectory = path.join(root, routePath);
  await fs.mkdir(targetDirectory, { recursive: true });
  await fs.copyFile(rootIndexPath, path.join(targetDirectory, "index.html"));
}

async function equipmentSlugs() {
  const equipmentSource = await fs.readFile(path.join(root, "lib", "equipment.ts"), "utf8");
  return [...equipmentSource.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
}

await copyDistToRoot();

await copyIndexToRoute("catalog");

for (const slug of await equipmentSlugs()) {
  await copyIndexToRoute(path.join("equipment", slug));
}

console.log("Prepared Render root publish fallback.");

import fsSync from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const buildRoot = path.join(root, ".deploy", "cpanel-node");
const appRoot = path.join(buildRoot, "tehrent-node");

async function resetDirectory(targetPath) {
  await fs.rm(targetPath, { recursive: true, force: true });
  await fs.mkdir(targetPath, { recursive: true });
}

async function copyIfExists(sourcePath, targetPath) {
  if (!fsSync.existsSync(sourcePath)) {
    return;
  }

  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.cp(sourcePath, targetPath, { recursive: true });
}

async function writeReadme() {
  const content = `cPanel Node.js package for tehrent

1. Upload the tehrent-node folder to your hosting account, for example to /home/USER/nodeapps/tehrent.
2. In cPanel open Setup Node.js App.
3. Create an app with:
   - Node.js version: 20.x or 22.x
   - Application mode: Production
   - Application root: nodeapps/tehrent
   - Application URL: your domain or subdomain
   - Application startup file: app.js
4. Open the Terminal in cPanel and run:
   npm install --omit=dev
5. Add environment variables:
   - NODE_ENV=production
   - APP_BASE_PATH=/test (or / for the main domain)
   - TELEGRAM_BOT_TOKEN=...
   - TELEGRAM_CHAT_ID=...
   - TELEGRAM_THREAD_ID=... (optional)
   - LEADS_TIMEZONE=Europe/Minsk
6. Restart the application in cPanel.

Important:
- dist is already included, so npm run build on the server is not required.
- Existing uploaded files are copied to data/uploads.
`;

  await fs.writeFile(path.join(appRoot, "README-CPANEL.txt"), content, "utf8");
}

await resetDirectory(appRoot);

await copyIfExists(path.join(root, "dist"), path.join(appRoot, "dist"));
await copyIfExists(path.join(root, "server"), path.join(appRoot, "server"));
await copyIfExists(path.join(root, "lib", "seo.js"), path.join(appRoot, "lib", "seo.js"));
await copyIfExists(path.join(root, "data", "equipment.json"), path.join(appRoot, "data", "equipment.json"));
await copyIfExists(path.join(root, "public", "uploads"), path.join(appRoot, "data", "uploads"));
await copyIfExists(path.join(root, "package.json"), path.join(appRoot, "package.json"));
await copyIfExists(path.join(root, "package-lock.json"), path.join(appRoot, "package-lock.json"));
await copyIfExists(path.join(root, "app.js"), path.join(appRoot, "app.js"));

await writeReadme();

console.log(`Prepared cPanel Node app at ${appRoot}`);

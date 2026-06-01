import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const isProduction = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT || 3001);

const leadSchema = z
  .object({
    name: z.string().trim().optional(),
    phone: z
      .string()
      .trim()
      .min(6)
      .refine((value) => value.replace(/[^\d+]/g, "").length >= 6),
    task: z.string().trim().optional(),
    equipmentId: z.string().trim().optional(),
    rentalPeriod: z.string().trim().optional(),
    address: z.string().trim().optional(),
    sourcePage: z.string(),
    selectedEquipment: z.array(z.string()).default([]),
    formType: z.string(),
    utm: z.record(z.string()).default({})
  })
  .refine((data) => Boolean(data.task?.length || data.equipmentId?.length), {
    path: ["task"]
  });

async function createApp() {
  const app = express();
  app.use(express.json());

  app.post("/api/leads", (request, response) => {
    const parsed = leadSchema.safeParse(request.body);

    if (!parsed.success) {
      response.status(400).json({
        success: false,
        errors: parsed.error.flatten()
      });
      return;
    }

    console.log("[lead]", {
      createdAt: new Date().toISOString(),
      ...parsed.data
    });

    response.json({ success: true });
  });

  if (isProduction) {
    const clientPath = path.join(root, "dist/client");
    app.use(express.static(clientPath));
    app.get("*", (_request, response) => {
      response.sendFile(path.join(clientPath, "index.html"));
    });
  } else {
    const vite = await createViteServer({
      root,
      server: {
        middlewareMode: true
      },
      appType: "spa"
    });

    app.use(vite.middlewares);
    app.use("*", async (request, response, next) => {
      try {
        const url = request.originalUrl;
        let template = fs.readFileSync(path.resolve(root, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        response.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (error) {
        vite.ssrFixStacktrace(error);
        next(error);
      }
    });
  }

  return app;
}

createApp().then((app) => {
  app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}`);
  });
});

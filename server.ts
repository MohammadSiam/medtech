import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { ensureSeedData } from "./server/models/seed";
import apiRouter from "./server/routes/api.routes";

const app = express();
const PORT = 3000;

app.use(express.json());

// Boot trigger for essential seeding data
ensureSeedData().catch(err => {
  console.error("Auto seeding failed:", err);
});

// Mount modular routing architecture (Monolith Pattern)
app.use("/api", apiRouter);

async function startServer() {
  // Static asset handler and Vite developer orchestration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Global process error bounds handler to survive sandboxed environments safely
  process.on("uncaughtException", (error) => {
    console.error("Uncaught system crash exception caught inside diagnostic runtime:", error);
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Diagnostic Center Full-Stack System executing actively on http://0.0.0.0:${PORT}`);
  });
}

startServer();

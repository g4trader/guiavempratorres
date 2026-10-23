import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

export default defineConfig({
  ...base,
  testMatch: "image-editor.spec.ts",
  metadata: { requireImageDemo: true },
  use: { ...base.use, baseURL: "http://127.0.0.1:3010" },
  webServer: {
    command: "pnpm dev --hostname 127.0.0.1 --port 3010",
    url: "http://127.0.0.1:3010/demonstracao/imagens",
    reuseExistingServer: false,
    timeout: 120_000
  }
});

import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      root: __dirname,
      setupFiles: ["./vitest.setup.ts"],
    },
  })
);

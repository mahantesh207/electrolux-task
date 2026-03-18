import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const vendorChunkGroups: Record<string, string[]> = {
  "vendor-react": ["react", "react-dom", "scheduler"],
  "vendor-router": ["react-router", "react-router-dom"],
  "vendor-state": ["@reduxjs/toolkit", "react-redux", "redux", "immer", "reselect"],
  "vendor-query": [
    "@tanstack/query-core",
    "@tanstack/react-query",
    "@tanstack/react-query-devtools",
  ],
  "vendor-feedback": ["react-toastify"],
};

const isPackageModule = (id: string, packageName: string) =>
  id.includes(`/node_modules/${packageName}/`) ||
  id.includes(`\\node_modules\\${packageName}\\`);

const getManualChunk = (id: string) => {
  if (!id.includes("node_modules") || id.endsWith(".css")) {
    return undefined;
  }

  for (const [chunkName, packages] of Object.entries(vendorChunkGroups)) {
    if (packages.some((packageName) => isPackageModule(id, packageName))) {
      return chunkName;
    }
  }

  return "vendor";
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        assetFileNames: ({ name }) => {
          if (name?.endsWith(".css")) {
            return "assets/css/[name]-[hash][extname]";
          }

          return "assets/[name]-[hash][extname]";
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        manualChunks: getManualChunk,
      },
    },
  },
  test: {
    css: true,
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    coverage: {
      exclude: [
        "src/main.tsx",
        "src/router/**",
        "src/test/**",
        "src/types/**",
        "**/*.test.ts",
        "**/*.test.tsx",
      ],
      include: ["src/**/*.{ts,tsx}"],
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
    },
  },
});

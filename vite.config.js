import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "src/assets",
          dest: "",
        },
      ],
    }),
  ],
  build: {
    outDir: "dist",
    // assetsDir: 'assets',
    emptyOutDir: true,
  },
  base: "/AssetSphere/",
  server:
    command === "serve"
      ? {
          hmr: true,
        }
      : undefined,
}));

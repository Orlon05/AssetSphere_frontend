import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
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
  base: "/inveplus/",
  server: {
    hmr: {
      port: 443,
    },
  },
});

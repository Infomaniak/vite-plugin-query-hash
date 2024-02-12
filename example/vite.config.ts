import { defineConfig } from "vite";
import ruby from "vite-plugin-ruby";
import queryHash from "vite-plugin-query-hash";

export default defineConfig({
  build: {
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  plugins: [ruby(), queryHash()],
});

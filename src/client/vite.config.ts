import { resolve } from "path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import path from "path";

const postcssImport = require("postcss-import");

export default defineConfig({
  // experimental: {
  //     renderBuiltUrl(filename: string, {hostId, hostType, type}: {
  //         hostId: string,
  //         hostType: "js" | "css" | "html",
  //         type: "public" | "asset"
  //     }) {
  //         return "/assets/" + filename
  //     }
  // },

  plugins: [solidPlugin()],
  css: {
    postcss: {
      plugins: [
        postcssImport,
        autoprefixer,
        tailwindcss,
      ],
    },
  },
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
    outDir: path.resolve(__dirname, "../static/"),
    assetsDir: "",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
});

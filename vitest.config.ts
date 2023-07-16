import { defineConfig } from "vitest/config"
import vue from "@vitejs/plugin-vue"
import { quasar, transformAssetUrls } from "@quasar/vite-plugin"
import tsconfigPaths from "vite-tsconfig-paths"
import AutoImport from "unplugin-auto-import/vite"

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: "test/vitest/setup-file.ts",
    include: [
      // Matches vitest tests in any subfolder of 'src' or into 'test/vitest/__tests__'
      // Matches all files with extension 'js', 'jsx', 'ts' and 'tsx'
      "src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "test/vitest/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
  },
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar({
      sassVariables: "src/quasar-variables.scss",
    }),
    tsconfigPaths(),
    AutoImport({
      resolvers: [],
      // targets to transform
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],

      // global imports to register
      imports: [
        // presets
        "vue",
        "vue-router",
        {
          "@iconify/vue": ["Icon"],
          "@vueuse/core": ["computedAsync"],
        },
      ],
      dirs: ["src/logic/*.ts"],
      eslintrc: {
        enabled: true, // Default `false`
        filepath: "./.eslintrc-auto-import.json", // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
    }),
  ],
})

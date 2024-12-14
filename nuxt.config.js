import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  modules: [
    "@pinia/nuxt",
    "nuxt-security",
    "@nuxtjs/google-fonts", 
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  css: [
    "~/assets/css/global.css" 
  ],
  googleFonts: {
    families: {
      "Lexend Deca": [100, 400, 700, 900], 
    },
    display: "swap", 
  },
  plugins: ["~/plugins/axios.client.ts", "~/plugins/toastification.js"],
  runtimeConfig: {
    public: {
      backBaseUrl: process.env.BACK_BASE_URL,
    },
  },
  typescript: {
    strict: true,
    typeCheck: true,
  },
  compatibilityDate: "2024-10-23",
  build: {
    transpile: ["vuetify"] 
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    resolve: {
      alias: {
        '@vue-leaflet/vue-leaflet': '@vue-leaflet/vue-leaflet' // 🔥 Ensure Vite resolves this path
      }
    },
    optimizeDeps: {
      include: ['@vue-leaflet/vue-leaflet'] // 🔥 Force Vite to pre-bundle it
    }
  },
});  

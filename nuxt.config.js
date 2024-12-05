import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  modules: [
    "@pinia/nuxt",
    "nuxt-security",
    "@nuxtjs/google-fonts", // Agrega el módulo de Google Fonts aquí
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  css: ["~/assets/css/global.css"],
  googleFonts: {
    families: {
      "Lexend Deca": [100, 400, 700, 900], // Especifica los pesos necesarios
    },
    display: "swap", // Define cómo se muestra la fuente mientras se carga
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
    transpile: ["vuetify"],
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});

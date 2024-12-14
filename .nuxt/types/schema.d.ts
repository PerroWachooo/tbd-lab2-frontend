import { NuxtModule, RuntimeConfig } from '@nuxt/schema'
declare module '@nuxt/schema' {
  interface NuxtOptions {
    /**
     * Configuration for `@pinia/nuxt`
     */
    ["pinia"]: typeof import("@pinia/nuxt").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `nuxt-security`
     */
    ["security"]: typeof import("nuxt-security").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `@nuxtjs/google-fonts`
     */
    ["googleFonts"]: typeof import("@nuxtjs/google-fonts").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/devtools`
     */
    ["devtools"]: typeof import("@nuxt/devtools").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     */
    ["telemetry"]: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? O : Record<string, any>
  }
  interface NuxtConfig {
    /**
     * Configuration for `@pinia/nuxt`
     */
    ["pinia"]?: typeof import("@pinia/nuxt").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `nuxt-security`
     */
    ["security"]?: typeof import("nuxt-security").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxtjs/google-fonts`
     */
    ["googleFonts"]?: typeof import("@nuxtjs/google-fonts").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/devtools`
     */
    ["devtools"]?: typeof import("@nuxt/devtools").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     */
    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    modules?: (undefined | null | false | NuxtModule<any> | string | [NuxtModule | string, Record<string, any>] | ["@pinia/nuxt", Exclude<NuxtConfig["pinia"], boolean>] | ["nuxt-security", Exclude<NuxtConfig["security"], boolean>] | ["@nuxtjs/google-fonts", Exclude<NuxtConfig["googleFonts"], boolean>] | ["@nuxt/devtools", Exclude<NuxtConfig["devtools"], boolean>] | ["@nuxt/telemetry", Exclude<NuxtConfig["telemetry"], boolean>])[],
  }
}
declare module 'nuxt/schema' {
  interface NuxtOptions {
    /**
     * Configuration for `@pinia/nuxt`
     * @see https://www.npmjs.com/package/@pinia/nuxt
     */
    ["pinia"]: typeof import("@pinia/nuxt").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `nuxt-security`
     * @see https://www.npmjs.com/package/nuxt-security
     */
    ["security"]: typeof import("nuxt-security").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `@nuxtjs/google-fonts`
     * @see https://www.npmjs.com/package/@nuxtjs/google-fonts
     */
    ["googleFonts"]: typeof import("@nuxtjs/google-fonts").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/devtools`
     * @see https://www.npmjs.com/package/@nuxt/devtools
     */
    ["devtools"]: typeof import("@nuxt/devtools").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     * @see https://www.npmjs.com/package/@nuxt/telemetry
     */
    ["telemetry"]: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? O : Record<string, any>
  }
  interface NuxtConfig {
    /**
     * Configuration for `@pinia/nuxt`
     * @see https://www.npmjs.com/package/@pinia/nuxt
     */
    ["pinia"]?: typeof import("@pinia/nuxt").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `nuxt-security`
     * @see https://www.npmjs.com/package/nuxt-security
     */
    ["security"]?: typeof import("nuxt-security").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxtjs/google-fonts`
     * @see https://www.npmjs.com/package/@nuxtjs/google-fonts
     */
    ["googleFonts"]?: typeof import("@nuxtjs/google-fonts").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/devtools`
     * @see https://www.npmjs.com/package/@nuxt/devtools
     */
    ["devtools"]?: typeof import("@nuxt/devtools").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     * @see https://www.npmjs.com/package/@nuxt/telemetry
     */
    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    modules?: (undefined | null | false | NuxtModule<any> | string | [NuxtModule | string, Record<string, any>] | ["@pinia/nuxt", Exclude<NuxtConfig["pinia"], boolean>] | ["nuxt-security", Exclude<NuxtConfig["security"], boolean>] | ["@nuxtjs/google-fonts", Exclude<NuxtConfig["googleFonts"], boolean>] | ["@nuxt/devtools", Exclude<NuxtConfig["devtools"], boolean>] | ["@nuxt/telemetry", Exclude<NuxtConfig["telemetry"], boolean>])[],
  }
  interface RuntimeConfig {
   app: {
      buildId: string,

      baseURL: string,

      buildAssetsDir: string,

      cdnURL: string,
   },

   nitro: {
      envPrefix: string,
   },

   private: {
      basicAuth: boolean,
   },

   security: {
      headers: {
         crossOriginResourcePolicy: string,

         crossOriginOpenerPolicy: string,

         crossOriginEmbedderPolicy: string,

         contentSecurityPolicy: {
            "base-uri": Array<string>,

            "font-src": Array<string>,

            "form-action": Array<string>,

            "frame-ancestors": Array<string>,

            "img-src": Array<string>,

            "object-src": Array<string>,

            "script-src-attr": Array<string>,

            "style-src": Array<string>,

            "upgrade-insecure-requests": boolean,
         },

         originAgentCluster: string,

         referrerPolicy: string,

         strictTransportSecurity: {
            maxAge: number,

            includeSubdomains: boolean,
         },

         xContentTypeOptions: string,

         xDNSPrefetchControl: string,

         xDownloadOptions: string,

         xFrameOptions: string,

         xPermittedCrossDomainPolicies: string,

         xXSSProtection: string,

         permissionsPolicy: {
            camera: Array<string>,

            "display-capture": Array<string>,

            fullscreen: Array<string>,

            geolocation: Array<string>,

            microphone: Array<string>,
         },
      },

      requestSizeLimiter: {
         maxRequestSizeInBytes: number,

         maxUploadFileRequestInBytes: number,

         throwError: boolean,
      },

      rateLimiter: {
         tokensPerInterval: number,

         interval: string,

         fireImmediately: boolean,

         throwError: boolean,
      },

      xssValidator: {
         throwError: boolean,
      },

      corsHandler: {
         origin: string,

         methods: Array<string>,

         preflight: {
            statusCode: number,
         },

         throwError: boolean,
      },

      allowedMethodsRestricter: string,

      hidePoweredBy: boolean,

      enabled: boolean,

      csrf: boolean,

      nonce: boolean,
   },
  }
  interface PublicRuntimeConfig {
   backBaseUrl: string,
  }
}
declare module 'vue' {
        interface ComponentCustomProperties {
          $config: RuntimeConfig
        }
      }
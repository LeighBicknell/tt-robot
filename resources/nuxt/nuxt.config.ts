import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'path'

export default defineNuxtConfig({
  // or true if you need server-side rendering
  ssr: false,

  app: {
    baseURL: '/nuxt/', // This is the sub-directory in public where your assets will be available
    buildAssetsDir: '/nuxt/', // This tells Nuxt where to output the build assets
  },

  nitro: {
    preset: 'static',
    output: {
      publicDir: resolve(__dirname, '../../public/nuxt') // This is where your build files will go
    }
  },

  css: [
      'vuetify/lib/styles/main.sass',
       '@mdi/font/css/materialdesignicons.min.css'
  ],

  build: {
    transpile: ['vuetify'],
  },

  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },

  compatibilityDate: '2024-08-19',
})

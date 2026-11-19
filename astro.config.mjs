// @ts-check
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  base: 'blog.petri.zip',
  i18n: {
    locales: ['pt-br', 'en'],
    defaultLocale: 'pt-br',
  },
})

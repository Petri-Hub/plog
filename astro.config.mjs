// @ts-check
import { defineConfig } from 'astro/config'

import mdx from '@astrojs/mdx'

import vercel from '@astrojs/vercel'

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  i18n: {
    locales: ['pt-br', 'en'],
    defaultLocale: 'pt-br',
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
  devToolbar: {
    enabled: true,
    placement: 'bottom-right',
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
})

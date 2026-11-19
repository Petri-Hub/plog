// @ts-check
import { defineConfig } from 'astro/config'

import mdx from '@astrojs/mdx'

import vercel from '@astrojs/vercel'

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.petri.zip',
  integrations: [mdx(), react(), sitemap({
    i18n: {
      defaultLocale: 'pt-br',
      locales: {
        'pt-br': 'pt-br',
        'en': 'en-US'
      }
    }
  })],
  i18n: {
    locales: ['pt-br', 'en'],
    defaultLocale: 'pt-br',
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
  
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  devToolbar: {
    enabled: true,
    placement: 'bottom-right',
  },
})
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
    filter: (page) => {
      return page !== 'https://blog.petri.zip/'
    },
    serialize: (page) => {
      if(!page.links){
        page.links = []
      } 
      if(page.links.some(link => link.lang === 'x-default')){
        return page
      }
      page.links.push({
        lang: 'x-default',
        url: page.url.replace(/\/\w{2}-\w{2}\//gi, "/pt-br/"),
      })

      return page
    },
    i18n: {
      defaultLocale: 'pt-br',
      locales: {
        'pt-br': 'pt-BR',
        'en-us': 'en-US'
      }
    }
  })],
  i18n: {
    locales: ['pt-br', 'en-us'],
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
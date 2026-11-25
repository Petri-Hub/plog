import { defineConfig, fontProviders } from 'astro/config'
import vercel from '@astrojs/vercel'
import preact from '@astrojs/preact'
import sitemap from '@astrojs/sitemap'

const site = 'https://blog.petri.zip'

export default defineConfig({
  site,
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Cormorant Garamond',
      cssVariable: '--font-accent',
    },
    {
      provider: fontProviders.google(),
      name: 'Shantell Sans',
      cssVariable: '--font-decorative',
    },
    {
      provider: fontProviders.google(),
      name: 'Google Sans',
      cssVariable: '--font-text',
    },
  ],
  integrations: [
    preact({ compat: true }),
    sitemap({
      filter: (page) => {
        return page !== `${site}/`
      },
      serialize: (page) => {
        if (!page.links) {
          page.links = []
        }
        if (page.links.some((link) => link.lang === 'x-default')) {
          return page
        }
        page.links.push({
          lang: 'x-default',
          url: page.url.replace(/\/\w{2}-\w{2}\//gi, '/pt-br/'),
        })

        return page
      },
      i18n: {
        defaultLocale: 'pt-br',
        locales: {
          'pt-br': 'pt-BR',
          'en-us': 'en-US',
        },
      },
    }),
  ],
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

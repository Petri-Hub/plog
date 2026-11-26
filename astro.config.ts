import { defineConfig, fontProviders } from 'astro/config'
import vercel from '@astrojs/vercel'
import preact from '@astrojs/preact'
import sitemap from '@astrojs/sitemap'
import { satteri } from '@astrojs/markdown-satteri'
import { codeFigurePlugin } from './src/markdown/code.plugin'
import { codeTheme } from './src/markdown/code.theme'
import { codeTitleTransformer } from './src/markdown/code.transformer'

const site = 'https://blog.petri.zip'

export default defineConfig({
  site,
  markdown: {
    shikiConfig: {
      theme: codeTheme,
      transformers: [codeTitleTransformer],
    },
    processor: satteri({
      hastPlugins: [codeFigurePlugin],
    }),
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Cormorant Garamond',
      cssVariable: '--font-title',
      weights: [400, 600, 700],
      styles: ['normal', 'italic'],
      fallbacks: ['serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Google Sans',
      cssVariable: '--font-text',
      weights: [400, 600],
      styles: ['normal'],
    },
    {
      provider: fontProviders.local(),
      name: 'Excalifont',
      cssVariable: '--font-hand',
      fallbacks: ['cursive'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/Excalifont-Regular.woff2'],
            weight: 400,
            style: 'normal',
          },
        ],
      },
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

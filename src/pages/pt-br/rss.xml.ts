import { getRecentPosts } from '@/contents/services/post.service'
import { getStrings } from '@/i18n/strings'
import { getLanguageDetails } from '@/utils/locale.utils'
import { createUrlFromPostId } from '@/utils/post.utils'
import type { APIRoute } from 'astro'
import rss from '@astrojs/rss'
import { getRelativeLocaleUrl } from 'astro:i18n'

export const GET: APIRoute = async (context) => {
  if (!context.site) {
    throw new Error('Cannot generate RSS feed. Site is not defined in Astro configuration.')
  }

  const language = 'pt-br'
  const strings = getStrings(language)
  const posts = await getRecentPosts(language)

  return rss({
    title: strings.rss.title,
    description: strings.rss.description,
    site: new URL(getRelativeLocaleUrl(language), context.site),
    trailingSlash: false,
    customData: `<language>${getLanguageDetails(language).tag}</language>`,
    items: posts.map(({ id, data: { title, description, date, tags } }) => ({
      title,
      description,
      pubDate: date,
      categories: tags,
      link: createUrlFromPostId(id),
    })),
  })
}

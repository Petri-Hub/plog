import { getPosts } from '@/contents/services/post.service'
import type { APIRoute } from 'astro'
import rss from '@astrojs/rss'
import { getRelativeLocaleUrl } from 'astro:i18n'

const LANGUAGE = 'pt-br'

export const GET: APIRoute = async (context) => {
  if (!context.site)
    throw new Error('Cannot generate RSS feed. Site is not defined in Astro configuration.')

  const posts = await getPosts(LANGUAGE)

  return rss({
    title: 'PLOG',
    description: "Petri's blog. Tecnologia e assuntos gerais.",
    site: context.site,
    trailingSlash: false,
    items: posts.map(({ id, data: { title, description, date, tags } }) => ({
      title: title,
      description: description,
      pubDate: date,
      categories: tags,
      link: getRelativeLocaleUrl(LANGUAGE, `/posts/${id}`),
    })),
  })
}

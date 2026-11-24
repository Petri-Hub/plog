import { getRecentPosts } from '@/contents/services/post.service'
import { getStrings } from '@/i18n/strings'
import { getLanguageDetails, languages } from '@/utils/locale.utils'
import { createMarkdownUrlFromPostId } from '@/utils/post.utils'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error('Cannot generate llms.txt. Site is not defined in Astro configuration.')
  }

  const summary = `> ${getStrings('en-us').home.description}`

  const sections = await Promise.all(
    languages.map(async (language) => {
      const posts = await getRecentPosts(language)
      const links = posts.map(({ id, data }) => {
        const url = new URL(createMarkdownUrlFromPostId(id), site).href

        return `- [${data.title}](${url}): ${data.description}`
      })

      return [`## ${getLanguageDetails(language).name}`, links.join('\n')].join('\n\n')
    }),
  )

  const text = ['# PLOG', summary, ...sections, ''].join('\n\n')

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}

import type { Post } from '@/types/content.types'
import type { AlternateLanguageLinks, Language } from '@/types/language.types'
import { getLanguageDetails, languages, toLanguage } from './locale.utils'

export const toPostLanguage = (id: string): Language => {
  return toLanguage(id.split('/')[0])
}

export const toPostSlug = (id: string): string => {
  return id.split('/').slice(1).join('/')
}

export const createUrlFromPostId = (id: string): string => {
  return `/${toPostLanguage(id)}/posts/${toPostSlug(id)}`
}

export const createMarkdownUrlFromPostId = (id: string): string => {
  return `${createUrlFromPostId(id)}.md`
}

export const toAlternateMap = ({ id, data }: Post): AlternateLanguageLinks => {
  const getAlternateUrl = (language: Language): string => {
    const alternate = data.alternates.find((alternate) => {
      return toPostLanguage(alternate.id) === language
    })

    if (!alternate) {
      throw new Error(`Post "${id}" has no "${language}" alternate`)
    }

    return createUrlFromPostId(alternate.id)
  }

  return {
    'pt-br': getAlternateUrl('pt-br'),
    'en-us': getAlternateUrl('en-us'),
  }
}

export const toPostMarkdown = (post: Post, site: URL): string => {
  const { id, data, body } = post

  if (!body) {
    throw new Error(`Post "${id}" has no body`)
  }

  const alternates = toAlternateMap(post)
  const translations = languages
    .filter((language) => language !== toPostLanguage(id))
    .map((language) => {
      const url = new URL(`${alternates[language]}.md`, site).href

      return `- Translation (${getLanguageDetails(language).name}): ${url}`
    })

  const metadata = [
    `- Date: ${data.date.toISOString().slice(0, 10)}`,
    `- Page: ${new URL(createUrlFromPostId(id), site).href}`,
    ...translations,
  ]

  if (data.tags.length > 0) {
    metadata.push(`- Tags: ${data.tags.join(', ')}`)
  }

  return [`# ${data.title}`, `> ${data.description}`, metadata.join('\n'), body.trim(), ''].join(
    '\n\n',
  )
}

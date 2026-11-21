import type { Post } from '../types/content.types'
import type { AlternateLanguageLinks, Language } from '../types/language.types'
import { toLanguage } from './locale.utils'

export const toPostLanguage = (id: string): Language => {
  return toLanguage(id.split('/')[0])
}

export const toPostSlug = (id: string): string => {
  return id.split('/').slice(1).join('/')
}

export const createUrlFromPostId = (id: string): string => {
  return `/${toPostLanguage(id)}/posts/${toPostSlug(id)}`
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

import type { Language } from '../types/language.types'

export const isPortuguesePath = (pathname: string): boolean => {
  return pathname.startsWith('/pt-br/') || pathname.startsWith('pt-br/')
}

export const isEnglishPath = (pathname: string): boolean => {
  return pathname.startsWith('/en-us/') || pathname.startsWith('en-us/')
}

export const getLocale = (): Language | null => {
  if (!window) {
    return null
  }

  const location = window.location
  const pathname = location.pathname

  if (isPortuguesePath(pathname)) return 'pt-br'

  if (isEnglishPath(pathname)) return 'en-us'

  return null
}

export const getLocaleOrFallbackTo = (language: Language): Language => {
  return getLocale() ?? language
}

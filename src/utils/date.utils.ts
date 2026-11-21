import type { Language } from '../types/language.types'
import { getLanguageDetails } from './locale.utils'

export const toLocalizedDate = (date: Date, language: Language): string => {
  const { tag } = getLanguageDetails(language)

  return new Intl.DateTimeFormat(tag, {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(date)
}

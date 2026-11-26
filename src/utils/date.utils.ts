import type { Language } from '@/types/language.types'
import { getLanguageDetails } from './locale.utils'

export const toLocalizedDate = (date: Date, language: Language): string => {
  const { tag } = getLanguageDetails(language)

  return new Intl.DateTimeFormat(tag, {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(date)
}

export const toLocalizedDayMonth = (date: Date, language: Language): string => {
  const { tag } = getLanguageDetails(language)

  return new Intl.DateTimeFormat(tag, {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(date)
}

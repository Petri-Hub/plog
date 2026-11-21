import type { Language, LanguageDetails } from '../types/language.types'

const details: Record<Language, LanguageDetails> = {
  'pt-br': { tag: 'pt-BR', name: 'Português', label: 'PT' },
  'en-us': { tag: 'en-US', name: 'English', label: 'EN' },
}

export const languages: Language[] = ['pt-br', 'en-us']

const isLanguage = (value: string | undefined): value is Language => {
  return languages.some((language) => language === value)
}

export const toLanguage = (locale: string | undefined): Language => {
  if (!isLanguage(locale)) {
    throw new Error(`Locale "${locale}" is not a supported language`)
  }

  return locale
}

export const getLanguageDetails = (language: Language): LanguageDetails => {
  return details[language]
}

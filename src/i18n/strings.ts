import type { Strings } from '@/types/i18n.types'
import type { Language } from '@/types/language.types'
import { enUs } from './en-us'
import { ptBr } from './pt-br'

const dictionaries: Record<Language, Strings> = {
  'pt-br': ptBr,
  'en-us': enUs,
}

export const getStrings = (language: Language): Strings => {
  return dictionaries[language]
}

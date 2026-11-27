import type { Language } from './language.types'

type SearchDocument = {
  title: string
  description: string
  tags: string[]
  date: string
  url: string
}

export type SearchEntry = Record<Language, SearchDocument>

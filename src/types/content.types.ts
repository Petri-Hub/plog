import { type CollectionEntry } from 'astro:content'
import type { Language } from './language.types'

export type Post = CollectionEntry<'posts'>

export type PostAlternate = {
  id: string
}

export type PostWithLanguage = Post & {
  language: Language
}

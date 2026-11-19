import { type CollectionEntry } from 'astro:content'

export type Post = CollectionEntry<'posts'>

export type PostAlternate = {
  id: string
}

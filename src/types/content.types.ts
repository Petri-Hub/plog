import type { CollectionEntry } from 'astro:content'

export type Post = CollectionEntry<'posts'>

export type AdjacentPosts = {
  newer: Post | undefined
  older: Post | undefined
}

import { getCollection, type CollectionEntry } from "astro:content";

type Post = CollectionEntry<'posts'>

type Language = 'pt-br' | 'en'

export const getPosts = async (language: Language): Promise<Post[]> => {
  return await getCollection('posts', (post) => {
    return post.id.startsWith(language + '/')
  })
}

export const getHighlightedPosts = async (language: Language): Promise<Post[]> => {
  const posts = await getPosts(language)
  const highlighted = posts.filter(post => post.data.highlighted)

  return highlighted
}

export const getPostById = async (language: Language, id: string): Promise<Post | null> => {
  const posts = await getPosts(language);
  const target = posts.find(post => post.id.endsWith(id)) 

  return target ?? null
}

export const getPostsOrderedByDate = async (language: Language): Promise<Post[]> => {
  const posts = await getPosts(language)
  const sorted = posts.sort((postA, postB) => postA.data.date.getTime() - postB.data.date.getTime())

  return sorted
}
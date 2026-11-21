import { getCollection, render, type RenderResult } from 'astro:content'
import type { Post } from '../../types/content.types'
import type { Language } from '../../types/language.types'
import { toPostLanguage } from '../../utils/post.utils'

export const getAllPosts = async (): Promise<Post[]> => {
  return await getCollection('posts')
}

export const getPosts = async (language: Language): Promise<Post[]> => {
  return await getCollection('posts', (post) => {
    return toPostLanguage(post.id) === language
  })
}

export const getHighlightedPosts = async (language: Language): Promise<Post[]> => {
  const posts = await getPosts(language)
  const highlighted = posts.filter((post) => post.data.highlighted)

  return highlighted
}

export const getRecentPosts = async (language: Language): Promise<Post[]> => {
  const posts = await getPosts(language)
  const recents = posts.toSorted((postA, postB) => {
    return postB.data.date.getTime() - postA.data.date.getTime()
  })

  return recents
}

export const getPostContent = async (post: Post): Promise<RenderResult> => {
  return await render(post)
}

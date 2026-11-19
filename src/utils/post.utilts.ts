import type { Post } from '../types/content.types'

export const getLanguageFromPostId = (postId: string) => {
  return postId.split('/').shift()
}

export const getPathFromPostId = (postId: string) => {
  return postId.split('/').slice(1).join('/')
}

export const createUrlFromPostId = (id: string): string => {
  const language = getLanguageFromPostId(id)
  const path = getPathFromPostId(id)

  return `/${language}/posts/${path}`
}

import type { PostAlternate } from '../types/content.types'
import type { AlternateLanguageLinks } from '../types/language.types'

export const toAlternateMap = (
  posts: PostAlternate[],
): AlternateLanguageLinks => {
  return Object.fromEntries(
    posts.map(({ id }) => {
      const language = id.split('/').shift()
      const title = id.split('/').slice(1).join('/')
      const link = [language, 'posts', title].join('/')

      return [language, '/' + link]
    }),
  )
}

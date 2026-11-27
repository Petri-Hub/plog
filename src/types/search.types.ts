import type { Post } from './content.types'

export type SearchEntry = Pick<Post['data'], 'title' | 'description' | 'tags' | 'date'> & {
  url: string
}

import type { Post } from '../../types/content.types'
import type { Language } from '../../types/language.types'
import { toLocalizedDate } from '../../utils/date.utils'
import { createUrlFromPostId } from '../../utils/post.utilts'

type Props = {
  posts: Post[]
  language: Language
}

export const PostList = ({ posts, language }: Props) => {
  return (
    <ul>
      {posts.map(({ id, data: { title, description, date, tags } }) => (
        <li key={id}>
          <a href={createUrlFromPostId(id)}>
            <article>
              <p>
                <time dateTime={date.toISOString()}>
                  {toLocalizedDate(date, language)}
                </time>{' '}
                {tags.map((tag) => `#${tag}`).join(' ')}
              </p>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          </a>
        </li>
      ))}
    </ul>
  )
}

import type { Language } from '@/types/language.types'
import { toLocalizedDate } from '@/utils/date.utils'
import { createUrlFromPostId } from '@/utils/post.utils'

type Item = {
  id: string
  title: string
  description: string
  date: Date
  tags: string[]
  highlighted: boolean
}

type Props = {
  items: Item[]
  language: Language
}

export const SearchContent = ({ items, language }: Props) => {
  return (
    <ul>
      {items.map(({ id, title, description, date }) => (
        <li key={id}>
          <a href={createUrlFromPostId(id)}>
            <p>{toLocalizedDate(date, language)}</p>
            <h4>{title}</h4>
            <p>{description}</p>
          </a>
        </li>
      ))}
    </ul>
  )
}

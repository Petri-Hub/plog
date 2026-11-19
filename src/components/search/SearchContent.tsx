import { createUrlFromPostId } from '../../utils/post.utilts'

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
}

export const SearchContent = ({ items }: Props) => {
  return (
    <ul>
      {items.map(({ id, title, description, date }) => (
        <li key={title}>
          <a href={createUrlFromPostId(id)}>
            <p>{date.toLocaleDateString()}</p>
            <h4>{title}</h4>
            <p>{description}</p>
          </a>
        </li>
      ))}
    </ul>
  )
}

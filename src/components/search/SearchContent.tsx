type Item = {
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
      {
        items.map(({ title, description, date }) => (
          <li key={title}>
            <p>{date.toLocaleDateString()}</p>
            <h4>{title}</h4>
            <p>{description}</p>
          </li>
        ))
      }
    </ul>
  )
}
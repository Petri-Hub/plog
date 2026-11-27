import styles from './SearchResults.module.css'
import type { Strings } from '@/types/i18n.types'
import type { Language } from '@/types/language.types'
import type { SearchEntry } from '@/types/search.types'
import { toLocalizedDate } from '@/utils/date.utils'
import { toHashtags } from '@/utils/post.utils'
import { toHighlightParts } from '@/utils/search.utils'

type Props = {
  results: SearchEntry[]
  count: number
  terms: string[]
  selected: number
  language: Language
  strings: Strings['search']
  onSelect: (entry: SearchEntry) => void
  onHover: (index: number) => void
}

export const SearchResults = ({
  results,
  count,
  terms,
  selected,
  language,
  strings,
  onSelect,
  onHover,
}: Props) => {
  const isSearching = terms.length > 0
  const countText =
    count === 1 ? strings.resultOne : strings.resultMany.replace('{count}', String(count))

  const renderHighlight = (text: string) => {
    return toHighlightParts(text, terms).map(({ text, isMatch }, index) => {
      return isMatch ? <mark key={index}>{text}</mark> : text
    })
  }

  return (
    <>
      <div className={styles.meta}>
        <p className={styles.heading} id="search-heading">
          {isSearching ? strings.matches : strings.recent}
        </p>
        <p className={styles.count} aria-live="polite">
          {isSearching ? countText : ''}
        </p>
      </div>
      <ul
        className={styles.results}
        id="search-results"
        role="listbox"
        aria-labelledby="search-heading"
      >
        {results.map((entry, index) => {
          const { title, description, tags, date, url } = entry[language]

          return (
            <li
              key={url}
              id={`search-result-${index}`}
              className={styles.result}
              role="option"
              aria-selected={index === selected}
              onClick={() => onSelect(entry)}
              onMouseMove={() => onHover(index)}
            >
              <span className={styles.resultMeta}>
                <time dateTime={date}>{toLocalizedDate(new Date(date), language)}</time>
                {tags.length > 0 && <span>{toHashtags(tags)}</span>}
              </span>
              <span className={styles.title}>{renderHighlight(title)}</span>
              <span className={styles.description}>{renderHighlight(description)}</span>
            </li>
          )
        })}
      </ul>
      {isSearching && results.length === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>{strings.empty}</p>
          <p className={styles.emptyHint}>{strings.emptyHint}</p>
        </div>
      )}
    </>
  )
}

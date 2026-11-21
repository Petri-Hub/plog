import { SearchHeader } from './SearchHeader'
import { SearchContent } from './SearchContent'
import type { Post } from '../../types/content.types'
import { useState, type FocusEvent, type InputEvent } from 'react'
import type { Strings } from '../../types/i18n.types'
import type { Language } from '../../types/language.types'
import { normalizeText } from '../../utils/text.utils'
import { useHotkeys } from 'react-hotkeys-hook'

type Props = {
  posts: Post[]
  enabled: boolean
  language: Language
  strings: Strings['search']
}

export const SearchMenu = ({ posts, enabled, language, strings }: Props) => {
  const [search, setSearch] = useState<string>('')
  const [selectedLanguage, setSelectedLanguage] = useState<Language | 'all'>(language)
  const [isEnabled, setIsEnabled] = useState<boolean>(enabled)

  useHotkeys(
    'mod+k',
    (event) => {
      event.preventDefault()

      setIsEnabled(!isEnabled)
      setSearch('')
    },
    {
      enabled: true,
      enableOnFormTags: true,
      enableOnContentEditable: true,
    },
  )

  if (!isEnabled) {
    return null
  }

  const handleInput = ({ currentTarget }: InputEvent<HTMLInputElement>): void => {
    setSearch(currentTarget.value)
  }

  const handleBlur = ({ currentTarget }: FocusEvent<HTMLInputElement>): void => {
    setSearch(currentTarget.value)
  }

  const handleLanguageChange = (selection: Language | 'all'): void => {
    setSelectedLanguage(selection)
  }

  const getSearchNormalized = (): string => {
    return normalizeText(search)
  }

  const getFilteredPosts = (): Post[] => {
    return posts.filter((post) => {
      return isPostMatchingLanguage(post) && isPostMatchingSearch(post)
    })
  }

  const getPostsAsResults = () => {
    return getFilteredPosts().map(
      ({ id, data: { title, description, tags, highlighted, date } }) => ({
        id,
        title,
        description,
        tags,
        highlighted,
        date,
      }),
    )
  }

  const isPostMatchingLanguage = (post: Post): boolean => {
    return selectedLanguage === 'all' || post.id.startsWith(selectedLanguage)
  }

  const isPostMatchingSearch = (post: Post): boolean => {
    const search = getSearchNormalized()
    const content = getPostContentNormalized(post)

    return content.includes(search)
  }

  const getPostContentNormalized = ({ id, body, data }: Post): string => {
    return normalizeText(
      [id, body, data.title, data.description, data.date, ...data.tags].join(' '),
    )
  }

  return (
    <div>
      <SearchHeader
        search={search}
        strings={strings}
        onInput={handleInput}
        onBlur={handleBlur}
        onLanguageChange={handleLanguageChange}
      />
      <SearchContent items={getPostsAsResults()} language={language} />
    </div>
  )
}

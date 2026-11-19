import { SearchHeader } from './SearchHeader'
import { SearchContent } from './SearchContent'
import type { Post } from '../../types/content.types'
import { useEffect, useState, type FocusEvent, type InputEvent } from 'react'
import { getLocale, getLocaleOrFallbackTo } from '../../utils/locale.utils'
import type { Language } from '../../types/language.types'
import { normalizeText } from '../../utils/text.utils'
import { useHotkeys } from 'react-hotkeys-hook'

type Props = {
  posts: Post[]
  enabled: boolean
}

export const SearchMenu = ({ posts, enabled }: Props) => {
  const locale = getLocaleOrFallbackTo('pt-br')

  const [search, setSearch] = useState<string>('')
  const [language, setLanguage] = useState<Language | 'all'>(locale)
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

  const handleInput = ({
    currentTarget,
  }: InputEvent<HTMLInputElement>): void => {
    setSearch(currentTarget.value)
  }

  const handleBlur = ({
    currentTarget,
  }: FocusEvent<HTMLInputElement>): void => {
    setSearch(currentTarget.value)
  }

  const handleLanguageChange = (language: Language | 'all'): void => {
    setLanguage(language)
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
    return language === 'all' || post.id.startsWith(language)
  }

  const isPostMatchingSearch = (post: Post): boolean => {
    const search = getSearchNormalized()
    const content = getPostContentNormalized(post)

    return content.includes(search)
  }

  const getPostContentNormalized = ({ id, body, data }: Post): string => {
    return normalizeText(
      [id, body, data.title, data.description, data.date, ...data.tags].join(
        ' ',
      ),
    )
  }

  return (
    <div>
      <SearchHeader
        search={search}
        onInput={handleInput}
        onBlur={handleBlur}
        onLanguageChange={handleLanguageChange}
      />
      <SearchContent items={getPostsAsResults()} />
    </div>
  )
}

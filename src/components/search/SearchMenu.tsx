import { SearchHeader } from './SearchHeader'
import { SearchContent } from './SearchContent'
import type { Post, PostWithLanguage } from '../../types/content.types'
import { useState, type FocusEvent, type InputEvent } from 'react'
import { getLocaleOrFallbackTo } from '../../utils/locale.utils'
import type { Language } from '../../types/language.types'
import { normalizeText } from '../../utils/text.utils'

type Props = {
  posts: Post[]
}

export const SearchMenu = ({ posts }: Props) => {
  const locale = getLocaleOrFallbackTo('pt-br')

  const [search, setSearch] = useState<string>('')
  const [language, setLanguage] = useState<Language | 'all'>(locale)

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
    return getFilteredPosts().map(({ data }) => ({
      title: data.title,
      description: data.description,
      tags: data.tags,
      highlighted: data.highlighted,
      date: data.date,
    }))
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

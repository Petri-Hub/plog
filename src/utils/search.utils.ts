import type { Post } from '@/types/content.types'
import type { Language } from '@/types/language.types'
import type { SearchEntry } from '@/types/search.types'
import { languages } from './locale.utils'
import { createUrlFromPostId, toPostLanguage, toPostSlug } from './post.utils'
import { normalizeText } from './text.utils'

type SearchDocument = SearchEntry[Language]

type HighlightPart = {
  text: string
  isMatch: boolean
}

export const toSearchEntries = (posts: Post[]): SearchEntry[] => {
  const slugs = [...new Set(posts.map(({ id }) => toPostSlug(id)))]

  const toEntry = (slug: string): SearchEntry => {
    const toDocument = (language: Language): SearchDocument => {
      const post = posts.find(({ id }) => {
        return toPostSlug(id) === slug && toPostLanguage(id) === language
      })

      if (!post) {
        throw new Error(`Post "${slug}" has no "${language}" version`)
      }

      const { title, description, tags, date } = post.data

      return {
        title,
        description,
        tags,
        date: date.toISOString(),
        url: createUrlFromPostId(post.id),
      }
    }

    return {
      'pt-br': toDocument('pt-br'),
      'en-us': toDocument('en-us'),
    }
  }

  return slugs.map(toEntry).toSorted((entryA, entryB) => {
    return entryB['en-us'].date.localeCompare(entryA['en-us'].date)
  })
}

export const toSearchTerms = (query: string): string[] => {
  return normalizeText(query)
    .split(/\s+/)
    .map((term) => term.replace(/^#/, ''))
    .filter((term) => term.length > 0)
}

export const toSearchMatches = (entries: SearchEntry[], terms: string[]): SearchEntry[] => {
  const toField = (entry: SearchEntry, pick: (document: SearchDocument) => string): string => {
    return normalizeText(languages.map((language) => pick(entry[language])).join(' '))
  }

  const toScore = (entry: SearchEntry): number => {
    const title = toField(entry, ({ title }) => title)
    const tags = toField(entry, ({ tags }) => tags.join(' '))
    const description = toField(entry, ({ description }) => description)
    let score = 0

    for (const term of terms) {
      if (title.includes(term)) {
        score += 3
      } else if (tags.includes(term)) {
        score += 2
      } else if (description.includes(term)) {
        score += 1
      } else {
        return 0
      }
    }

    return score
  }

  return entries
    .map((entry) => ({ entry, score: toScore(entry) }))
    .filter(({ score }) => score > 0)
    .toSorted((matchA, matchB) => matchB.score - matchA.score)
    .map(({ entry }) => entry)
}

export const toHighlightParts = (text: string, terms: string[]): HighlightPart[] => {
  const characters = [...text]
  const normalized = characters.map((character) => normalizeText(character))
  const flat = normalized.join('')
  const owners = normalized.flatMap((part, index) => [...part].map(() => index))
  const isMarked = characters.map(() => false)

  for (const term of terms) {
    let start = flat.indexOf(term)

    while (start !== -1) {
      for (let offset = start; offset < start + term.length; offset++) {
        isMarked[owners[offset]] = true
      }

      start = flat.indexOf(term, start + term.length)
    }
  }

  return characters.reduce<HighlightPart[]>((parts, character, index) => {
    const last = parts.at(-1)

    if (last && last.isMatch === isMarked[index]) {
      last.text += character
    } else {
      parts.push({ text: character, isMatch: isMarked[index] })
    }

    return parts
  }, [])
}

const isSearchDocument = (value: unknown): value is SearchDocument => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'title' in value &&
    typeof value.title === 'string' &&
    'description' in value &&
    typeof value.description === 'string' &&
    'date' in value &&
    typeof value.date === 'string' &&
    'url' in value &&
    typeof value.url === 'string' &&
    'tags' in value &&
    Array.isArray(value.tags) &&
    value.tags.every((tag) => typeof tag === 'string')
  )
}

export const isSearchEntries = (value: unknown): value is SearchEntry[] => {
  return (
    Array.isArray(value) &&
    value.every((entry) => {
      return (
        typeof entry === 'object' &&
        entry !== null &&
        languages.every((language) => language in entry && isSearchDocument(entry[language]))
      )
    })
  )
}

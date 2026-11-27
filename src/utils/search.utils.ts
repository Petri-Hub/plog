import type { Post } from '@/types/content.types'
import type { SearchEntry } from '@/types/search.types'
import { createUrlFromPostId } from './post.utils'
import { normalizeText } from './text.utils'

type HighlightPart = {
  text: string
  isMatch: boolean
}

export const toSearchEntries = (posts: Post[]): SearchEntry[] => {
  return posts.map(({ id, data: { title, description, tags, date } }) => {
    return { title, description, tags, date, url: createUrlFromPostId(id) }
  })
}

export const toSearchTerms = (query: string): string[] => {
  return normalizeText(query)
    .split(/\s+/)
    .map((term) => term.replace(/^#/, ''))
    .filter((term) => term.length > 0)
}

export const toSearchMatches = (entries: SearchEntry[], terms: string[]): SearchEntry[] => {
  const toScore = (entry: SearchEntry): number => {
    const title = normalizeText(entry.title)
    const tags = normalizeText(entry.tags.join(' '))
    const description = normalizeText(entry.description)
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
  const owners = normalized.flatMap((part, index) =>
    Array.from({ length: part.length }, () => index),
  )
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

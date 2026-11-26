import type { Strings } from '@/types/i18n.types'

export const enUs: Strings = {
  header: {
    subtitle: "petri's log",
    language: 'Language',
    theme: 'Dark mode',
  },
  footer: {
    tagline: "A log of what I'm studying, written down as I learn it. By Petri.",
    blog: 'This blog',
    home: 'Home',
    sitemap: 'Sitemap',
    elsewhere: 'Elsewhere',
    portfolio: 'Portfolio',
    built: 'Built with Astro.',
    source: 'Source code',
  },
  home: {
    title: 'Home',
    description: 'My technical blog, in Portuguese and English, written as I learn.',
    note: 'written down as I learn it',
    heading: "A log of what I'm",
    words: ['studying', 'building', 'breaking', 'reading'],
    subheading:
      'Software engineering, infrastructure and my homelab, explained while I learn them. Every post in Portuguese and English.',
    highlights: 'Start here',
    highlightsNote: "the posts I'd show a friend first",
    recents: 'All posts',
    recentsNote: 'newest first',
    upcoming: 'Coming up',
    upcomingNote: 'the to-do list for this blog',
  },
  upcoming: {
    analytics: {
      title: 'Analytics',
      text: 'A simple look at which posts people actually read, so I know what to write next.',
    },
    newsletter: {
      title: 'Newsletter',
      text: "New posts in your inbox, so you don't have to keep checking back.",
    },
    comments: {
      title: 'Comments',
      text: 'Tell me where I got it wrong, right under each post. Markdown welcome.',
    },
    decentPosts: {
      title: 'Decent posts',
      text: 'Working on it. Everything above was practice.',
    },
    next: 'next',
    planned: 'planned',
    someday: 'someday',
  },
  errors: {
    404: {
      title: 'Page not found',
      heading: "Seems this page doesn't exist",
      description: "Let's go back to the home page",
      back: 'Go back',
    },
    500: {
      title: 'Error',
      heading: 'Something went wrong here',
      description: "Let's go back to the home page",
      back: 'Go back',
    },
  },
  search: {
    label: 'Search posts',
    all: 'All',
  },
  post: {
    back: 'all posts',
    minutes: 'min read',
    contents: 'in this post',
    tldr: "TL;DR · can't read all that? ask Claude",
    tldrPrompt:
      'Read the article at {url} and give me:\n1. A TL;DR in two or three sentences.\n2. The key points, as a short list.\n3. Any commands or config worth remembering.\n4. One question I should be able to answer after reading it.\n5. What I would miss by reading only this summary, and why the full post is worth my time.\nKeep it short, and answer in English.',
    newTab: '(opens in a new tab)',
    keepReading: 'Keep reading',
    keepReadingNote: 'the posts next to this one',
    newer: '← newer',
    older: 'older →',
  },
  rss: {
    title: 'PLOG',
    description: 'My technical blog, in English, written as I learn.',
  },
}

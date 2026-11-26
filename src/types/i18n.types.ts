type UpcomingNoteStrings = {
  title: string
  text: string
}

type ErrorStrings = {
  title: string
  heading: string
  description: string
  back: string
}

export type Strings = {
  header: {
    subtitle: string
    language: string
    theme: string
  }
  footer: {
    tagline: string
    blog: string
    home: string
    sitemap: string
    elsewhere: string
    portfolio: string
    built: string
    source: string
  }
  home: {
    title: string
    description: string
    note: string
    heading: string
    words: [string, ...string[]]
    subheading: string
    highlights: string
    highlightsNote: string
    recents: string
    recentsNote: string
    upcoming: string
    upcomingNote: string
  }
  upcoming: {
    analytics: UpcomingNoteStrings
    newsletter: UpcomingNoteStrings
    comments: UpcomingNoteStrings
    decentPosts: UpcomingNoteStrings
    next: string
    planned: string
    someday: string
  }
  errors: Record<404 | 500, ErrorStrings>
  search: {
    label: string
    all: string
  }
  code: {
    copy: string
    copied: string
  }
  post: {
    back: string
    minutes: string
    contents: string
    tldr: string
    tldrPrompt: string
    newTab: string
    keepReading: string
    keepReadingNote: string
    newer: string
    older: string
  }
  rss: {
    title: string
    description: string
  }
}

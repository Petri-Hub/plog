type ErrorStrings = {
  title: string
  heading: string
  description: string
  back: string
}

export type Strings = {
  header: {
    language: string
  }
  home: {
    title: string
    description: string
    heading: string
    subheading: string
    highlights: string
    recents: string
  }
  errors: Record<404 | 500, ErrorStrings>
  search: {
    label: string
    all: string
  }
  rss: {
    title: string
    description: string
  }
}

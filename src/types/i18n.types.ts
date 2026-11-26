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

import type { Strings } from '../types/i18n.types'

export const enUs: Strings = {
  header: {
    language: 'Language',
  },
  home: {
    title: 'Home',
    heading: 'Welcome to my blog',
    subheading: 'Tech things here and there',
    highlights: 'Highlights',
    recents: 'Recents',
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
}

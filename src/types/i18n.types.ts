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
    button: string
    label: string
    placeholder: string
    close: string
    recent: string
    matches: string
    resultOne: string
    resultMany: string
    empty: string
    emptyHint: string
    keyMove: string
    keyOpen: string
    keyClose: string
  }
  desk: {
    latencyWhy: string
    dnsNote: string
    subnetMe: string
    synHi: string
    synAckHi: string
    ackYes: string
    draftOld: string
    draftOld2: string
    draftNew: string
    paletteTitle: string
    certTitle: string
    certIssued: string
    stampText: string
    regretsTitle: string
    regretsSpace: string
    crashLoop: string
    measureTitle: string
    measureNote: string
    estimateTitle: string
    estimateGuess: string
    estimateReal: string
    portsTemp: string
    haiku1: string
    haiku2: string
    statusTeapot: string
    todoTitle: string
    todoRss: string
    todoSitemap: string
    todoDark: string
    todoPost: string
    todoGrass: string
    bigONote: string
    receiptCoffee: string
    receiptTabs: string
    receiptQuickFix: string
    receiptTotal: string
    receiptBye: string
    blameAgo: string
    blameNote: string
    coffeeFig: string
    shipIt: string
    pmCause: string
    pmRows: string
    pmFoundBy: string
    pmFoundValue: string
    pmDowntime: string
    pmNote: string
    pmAction1: string
    pmAction2: string
    calWeekday: string
    calNote: string
  }
  code: {
    copy: string
    copied: string
    failed: string
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

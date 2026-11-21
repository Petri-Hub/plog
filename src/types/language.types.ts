export type Language = 'pt-br' | 'en-us'

export type AlternateLanguageLinks = Record<Language, string>

export type LanguageDetails = {
  tag: string
  name: string
  label: string
}

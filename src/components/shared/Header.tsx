import type { Strings } from '@/types/i18n.types'
import type { AlternateLanguageLinks, Language } from '@/types/language.types'
import { getLanguageDetails, languages } from '@/utils/locale.utils'

type Props = {
  language: Language
  homeUrl: string
  alternates: AlternateLanguageLinks
  strings: Strings['header']
}

export const Header = ({ language, homeUrl, alternates, strings }: Props) => {
  return (
    <header>
      <a href={homeUrl}>PLOG</a>
      <nav aria-label={strings.language}>
        <ul>
          {languages.map((alternate) => {
            const { tag, name, label } = getLanguageDetails(alternate)

            return (
              <li key={alternate}>
                <a
                  href={alternates[alternate]}
                  hrefLang={tag}
                  lang={tag}
                  title={name}
                  aria-current={alternate === language ? 'page' : undefined}
                >
                  {label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}

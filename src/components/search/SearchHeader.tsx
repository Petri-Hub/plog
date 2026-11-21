import type { FocusEvent, InputEvent } from 'react'
import type { Strings } from '@/types/i18n.types'
import type { Language } from '@/types/language.types'
import { getLanguageDetails, languages } from '@/utils/locale.utils'

type Props = {
  search: string
  strings: Strings['search']
  onInput: (event: InputEvent<HTMLInputElement>) => void
  onBlur: (event: FocusEvent<HTMLInputElement>) => void
  onLanguageChange: (language: Language | 'all') => void
}

export const SearchHeader = ({ search, strings, onInput, onBlur, onLanguageChange }: Props) => {
  const handleInput = (event: InputEvent<HTMLInputElement>): void => {
    onInput(event)
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement>): void => {
    onBlur(event)
  }

  const handleLanguageSelection = (language: Language | 'all'): VoidFunction => {
    return (): void => {
      onLanguageChange(language)
    }
  }

  return (
    <div>
      <input
        autoFocus
        type="search"
        aria-label={strings.label}
        value={search}
        onInput={handleInput}
        onBlur={handleBlur}
      />
      <button onClick={handleLanguageSelection('all')}>{strings.all}</button>
      {languages.map((language) => (
        <button key={language} onClick={handleLanguageSelection(language)}>
          {getLanguageDetails(language).name}
        </button>
      ))}
    </div>
  )
}

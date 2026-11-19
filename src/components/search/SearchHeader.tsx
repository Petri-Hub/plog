import type { FocusEvent, InputEvent } from 'react'
import type { Language } from '../../types/language.types'

type Props = {
  search: string
  onInput: (event: InputEvent<HTMLInputElement>) => void
  onBlur: (event: FocusEvent<HTMLInputElement>) => void
  onLanguageChange: (language: Language | 'all') => void
}

export const SearchHeader = ({
  search,
  onInput,
  onBlur,
  onLanguageChange,
}: Props) => {
  const handleInput = (event: InputEvent<HTMLInputElement>): void => {
    onInput(event)
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement>): void => {
    onBlur(event)
  }

  const handleLanguageSelection = (
    language: Language | 'all',
  ): VoidFunction => {
    return (): void => {
      onLanguageChange(language)
    }
  }

  return (
    <div>
      <input
        autoFocus
        type="text"
        value={search}
        onInput={handleInput}
        onBlur={handleBlur}
      />
      <button onClick={handleLanguageSelection('all')}>Tudo</button>
      <button onClick={handleLanguageSelection('en-us')}>Inglês</button>
      <button onClick={handleLanguageSelection('pt-br')}>Português</button>
    </div>
  )
}

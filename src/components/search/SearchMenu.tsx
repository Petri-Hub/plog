import { navigate } from 'astro:transitions/client'
import type { TargetedInputEvent, TargetedKeyboardEvent, TargetedMouseEvent } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import { useHotkeys } from 'react-hotkeys-hook'
import { SearchResults } from './SearchResults'
import styles from './SearchMenu.module.css'
import type { Strings } from '@/types/i18n.types'
import type { Language } from '@/types/language.types'
import type { SearchEntry } from '@/types/search.types'
import { isSearchEntries, toSearchMatches, toSearchTerms } from '@/utils/search.utils'

type Props = {
  language: Language
  strings: Strings['search']
}

const recentLimit = 6
const matchLimit = 20

export const SearchMenu = ({ language, strings }: Props) => {
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const [entries, setEntries] = useState<SearchEntry[]>([])
  const [query, setQuery] = useState<string>('')
  const [selected, setSelected] = useState<number>(0)
  const [shortcut, setShortcut] = useState<string>('Ctrl K')

  const terms = toSearchTerms(query)
  const matches = toSearchMatches(entries, terms)
  const results = terms.length > 0 ? matches.slice(0, matchLimit) : entries.slice(0, recentLimit)

  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.userAgent)) {
      setShortcut('⌘ K')
    }
  }, [])

  useEffect(() => {
    document.getElementById(`search-result-${selected}`)?.scrollIntoView({ block: 'nearest' })
  }, [selected])

  const handleOpen = async (): Promise<void> => {
    setQuery('')
    setSelected(0)
    dialog.current?.showModal()
    input.current?.focus()

    if (entries.length === 0) {
      const response = await fetch('/search.json')
      const data: unknown = await response.json()

      if (isSearchEntries(data)) {
        setEntries(data)
      }
    }
  }

  const handleClose = (): void => {
    dialog.current?.close()
  }

  useHotkeys(
    'mod+k',
    (event) => {
      event.preventDefault()

      if (dialog.current?.open) {
        handleClose()
      } else {
        void handleOpen()
      }
    },
    { enableOnFormTags: true },
  )

  const handleSelect = (entry: SearchEntry): void => {
    handleClose()
    void navigate(entry[language].url)
  }

  const handleInput = ({ currentTarget }: TargetedInputEvent<HTMLInputElement>): void => {
    setQuery(currentTarget.value)
    setSelected(0)
  }

  const handleKeyDown = (event: TargetedKeyboardEvent<HTMLInputElement>): void => {
    if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && results.length > 0) {
      event.preventDefault()

      const step = event.key === 'ArrowDown' ? 1 : -1

      setSelected((index) => (index + step + results.length) % results.length)
    }

    const result = results[selected]

    if (event.key === 'Enter' && result) {
      event.preventDefault()
      handleSelect(result)
    }
  }

  const handleBackdropClick = ({
    target,
    currentTarget,
  }: TargetedMouseEvent<HTMLDialogElement>): void => {
    if (target === currentTarget) {
      handleClose()
    }
  }

  return (
    <>
      <button type="button" className={styles.trigger} onClick={handleOpen}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4.5 4.5" />
        </svg>
        <span className={styles.label}>{strings.button}</span>
        <kbd className={styles.shortcut}>{shortcut}</kbd>
      </button>
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-label={strings.label}
        onClick={handleBackdropClick}
      >
        <div className={styles.top}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4.5 4.5" />
          </svg>
          <input
            ref={input}
            className={styles.input}
            type="search"
            aria-label={strings.label}
            aria-controls="search-results"
            aria-autocomplete="list"
            aria-activedescendant={results.length > 0 ? `search-result-${selected}` : undefined}
            autoComplete="off"
            spellcheck={false}
            placeholder={strings.placeholder}
            value={query}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
          />
          <button type="button" className={styles.close} onClick={handleClose}>
            <kbd>esc</kbd>
            <span className="sr-only">{strings.close}</span>
          </button>
        </div>
        <SearchResults
          results={results}
          count={matches.length}
          terms={terms}
          selected={selected}
          language={language}
          strings={strings}
          onSelect={handleSelect}
          onHover={setSelected}
        />
        <p className={styles.keys} aria-hidden="true">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> {strings.keyMove}
          </span>
          <span>
            <kbd>↵</kbd> {strings.keyOpen}
          </span>
          <span>
            <kbd>esc</kbd> {strings.keyClose}
          </span>
        </p>
      </dialog>
    </>
  )
}

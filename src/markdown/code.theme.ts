import type { ShikiConfig } from 'astro'

type ShikiTheme = NonNullable<ShikiConfig['theme']>

export const codeTheme: ShikiTheme = {
  name: 'plog',
  colors: {
    'editor.foreground': 'var(--color-ink)',
    'editor.background': 'var(--color-raised)',
  },
  tokenColors: [
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: 'var(--color-muted)', fontStyle: 'italic' },
    },
    {
      scope: [
        'keyword',
        'storage',
        'entity.name.tag',
        'entity.name.function',
        'support.function',
        'support.type.property-name',
      ],
      settings: { foreground: 'var(--color-crimson)' },
    },
    {
      scope: ['string', 'constant', 'variable.parameter', 'entity.other.attribute-name'],
      settings: { foreground: 'var(--color-blue)' },
    },
  ],
}

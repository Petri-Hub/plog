import type { ShikiConfig } from 'astro'

type ShikiTransformer = NonNullable<ShikiConfig['transformers']>[number]

export const codeTitleTransformer: ShikiTransformer = {
  name: 'plog-code-title',
  pre(node) {
    const title = this.options.meta?.__raw?.match(/title="([^"]+)"/)?.[1]

    if (title) {
      node.properties.dataTitle = title
    }
  },
}

import type { SatteriProcessorOptions } from '@astrojs/markdown-satteri'
import { getStrings } from '@/i18n/strings'
import { toPostLanguage } from '@/utils/post.utils'

type HastPlugin = NonNullable<SatteriProcessorOptions['hastPlugins']>[number]

export const codeFigurePlugin: HastPlugin = ({ fileURL }) => {
  if (!fileURL) {
    throw new Error('A Markdown file reached the code figure plugin without a file URL')
  }

  const postId = fileURL.pathname.split('/').slice(-3, -1).join('/')
  const strings = getStrings(toPostLanguage(postId)).code

  return {
    name: 'plog-code-figure',
    element: {
      filter: ['pre'],
      visit(node, ctx) {
        const label = String(node.properties.dataTitle ?? node.properties.dataLanguage ?? '')

        ctx.wrapNode(node, {
          type: 'element',
          tagName: 'figure',
          properties: { className: ['code'] },
          children: [
            {
              type: 'element',
              tagName: 'figcaption',
              properties: {},
              children: [
                {
                  type: 'element',
                  tagName: 'span',
                  properties: {},
                  children: [{ type: 'text', value: label }],
                },
                {
                  type: 'element',
                  tagName: 'button',
                  properties: { type: 'button', dataCopyCode: '', dataCopied: strings.copied },
                  children: [{ type: 'text', value: strings.copy }],
                },
              ],
            },
          ],
        })
      },
    },
  }
}

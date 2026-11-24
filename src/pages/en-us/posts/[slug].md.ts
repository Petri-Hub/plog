import { getPosts } from '@/contents/services/post.service'
import type { Post } from '@/types/content.types'
import { toPostMarkdown, toPostSlug } from '@/utils/post.utils'
import type { APIRoute } from 'astro'

export async function getStaticPaths() {
  const posts = await getPosts('en-us')

  return posts.map((post) => ({
    params: { slug: toPostSlug(post.id) },
    props: { post },
  }))
}

type Props = {
  post: Post
}

export const GET: APIRoute<Props> = ({ props, site }) => {
  if (!site) {
    throw new Error('Cannot generate post Markdown. Site is not defined in Astro configuration.')
  }

  return new Response(toPostMarkdown(props.post, site), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}

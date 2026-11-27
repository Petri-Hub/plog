import { getAllPosts } from '@/contents/services/post.service'
import { toSearchEntries } from '@/utils/search.utils'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  const entries = toSearchEntries(await getAllPosts())

  return new Response(JSON.stringify(entries), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

import IPostDAO from '../../interfaces/post/postDAO'
import ICache from '../../interfaces/cache'
import NotFoundError from '../../errors/notFoundError'

const CACHE_TTL = 60

export default class GetEngagementCounts {
  constructor(
    private postDAO: IPostDAO,
    private cache: ICache
  ) {}

  async call(postId: string): Promise<{ likes: number; comments: number; shares: number }> {
    const cacheKey = `engagement:${postId}`
    const cached = await this.cache.get<{ likes: number; comments: number; shares: number }>(cacheKey)
    if (cached) return cached

    const counts = await this.postDAO.getEngagementCounts(postId)
    if (!counts) throw new NotFoundError('Post not found')
    await this.cache.set(cacheKey, counts, CACHE_TTL)
    return counts
  }
}

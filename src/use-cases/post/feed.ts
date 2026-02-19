import { Post } from '../../entities'
import IPostDAO, { CursorPaginatedResult } from '../../interfaces/post/postDAO'
import ICache from '../../interfaces/cache'

const CACHE_TTL = 30
const DEFAULT_LIMIT = 10
const MAX_LIMIT = 50

export default class PostFeed {
  constructor(
    private postDAO: IPostDAO,
    private cache: ICache
  ) {}

  async call(
    cursor: string | null,
    limit: number = DEFAULT_LIMIT
  ): Promise<CursorPaginatedResult<Post>> {
    const safeLimit = Math.min(Math.max(1, limit), MAX_LIMIT)
    const cacheKey = `feed:${cursor ?? 'start'}:${safeLimit}`

    const cached = await this.cache.get<CursorPaginatedResult<Post>>(cacheKey)
    if (cached) return cached

    const result = await this.postDAO.getFeed(cursor, safeLimit)
    await this.cache.set(cacheKey, result, CACHE_TTL)
    return result
  }
}

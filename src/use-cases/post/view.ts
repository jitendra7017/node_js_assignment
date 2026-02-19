import { Post } from '../../entities'
import IPostDAO from '../../interfaces/post/postDAO'
import ICache from '../../interfaces/cache'
import NotFoundError from '../../errors/notFoundError'

const CACHE_TTL = 60

export default class ViewPost {
  constructor(
    private postDAO: IPostDAO,
    private cache: ICache
  ) {}

  async call(postId: string): Promise<Post> {
    const cacheKey = `post:${postId}`
    const cached = await this.cache.get<Post>(cacheKey)
    if (cached) return cached as Post

    const post = await this.postDAO.findById(postId)
    if (!post) throw new NotFoundError('Post not found')
    await this.cache.set(cacheKey, post, CACHE_TTL)
    return post
  }
}

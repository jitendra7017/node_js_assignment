import { Post } from '../../entities'
import IPostDAO from '../../interfaces/post/postDAO'
import ICache from '../../interfaces/cache'
import NotFoundError from '../../errors/notFoundError'

export default class SharePost {
  constructor(
    private postDAO: IPostDAO,
    private cache: ICache
  ) {}

  async call(postId: string): Promise<Post> {
    const post = await this.postDAO.share(postId)
    if (!post) throw new NotFoundError('Post not found')
    await this.cache.del(`post:${postId}`)
    await this.cache.del(`engagement:${postId}`)
    await this.cache.delPattern('feed:*')
    return post
  }
}

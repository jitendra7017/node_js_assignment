import { Post } from '../../entities'
import IPostDAO from '../../interfaces/post/postDAO'
import ICache from '../../interfaces/cache'

export default class CreatePost {
  constructor(
    private postDAO: IPostDAO,
    private cache: ICache
  ) {}

  async call(userId: string, text: string, mediaRefs?: string[]): Promise<Post> {
    const post = await this.postDAO.create({ userId, text, mediaRefs })
    await this.cache.delPattern('feed:*')
    return post
  }
}

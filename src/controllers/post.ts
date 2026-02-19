import {
  CreatePost,
  ViewPost,
  PostFeed,
  LikePost,
  UnlikePost,
  CommentPost,
  SharePost,
  GetEngagementCounts,
} from '../use-cases/post'
import IRequest from '../interfaces/request'

const MOCKED_USER_IDS = ['user-1', 'user-2', 'user-3']

export default class PostController {
  constructor(
    private createPost: CreatePost,
    private viewPost: ViewPost,
    private postFeed: PostFeed,
    private likePost: LikePost,
    private unlikePost: UnlikePost,
    private commentPost: CommentPost,
    private sharePost: SharePost,
    private getEngagementCounts: GetEngagementCounts
  ) {}

  private getUserId(req: IRequest): string {
    const raw = req.headers?.['x-user-id']
    const userId = Array.isArray(raw) ? raw[0] : raw

    if (userId && MOCKED_USER_IDS.includes(userId)) {
      return userId
    }
    return MOCKED_USER_IDS[0]
  }

  async create(req: IRequest) {
    const userId = this.getUserId(req)
    const body = req.body as { text?: string; mediaRefs?: string[] } | undefined
    const text = body?.text ?? ''
    const mediaRefs = body?.mediaRefs
    return this.createPost.call(userId, text, mediaRefs)
  }

  async view(req: IRequest) {
    const id = req.params?.id as string
    return this.viewPost.call(id)
  }

  async feed(req: IRequest) {
    const rawCursor = req.query?.cursor
    const rawLimit = req.query?.limit
    const cursor = typeof rawCursor === 'string' ? rawCursor : null
    const limit = rawLimit ? Number(rawLimit) : undefined
    return this.postFeed.call(cursor, limit)
  }

  async like(req: IRequest) {
    const userId = this.getUserId(req)
    const id = req.params?.id as string
    return this.likePost.call(id, userId)
  }

  async unlike(req: IRequest) {
    const userId = this.getUserId(req)
    const id = req.params?.id as string
    return this.unlikePost.call(id, userId)
  }

  async comment(req: IRequest) {
    const userId = this.getUserId(req)
    const id = req.params?.id as string
    const body = req.body as { text?: string } | undefined
    const text = body?.text ?? ''
    return this.commentPost.call(id, userId, text)
  }

  async share(req: IRequest) {
    const id = req.params?.id as string
    return this.sharePost.call(id)
  }

  async engagement(req: IRequest) {
    const id = req.params?.id as string
    return this.getEngagementCounts.call(id)
  }
}

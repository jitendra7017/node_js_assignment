import { Post } from '../../entities'

export interface CursorPagination {
  cursor?: string
  limit: number
}

export interface CursorPaginatedResult<T> {
  data: T[]
  nextCursor: string | null
  hasMore: boolean
}

export default interface IPostDAO {
  create(payload: {
    userId: string
    text: string
    mediaRefs?: string[]
  }): Promise<Post>
  findById(id: string): Promise<Post | null>
  getFeed(cursor: string | null, limit: number): Promise<CursorPaginatedResult<Post>>
  like(postId: string, userId: string): Promise<Post | null>
  unlike(postId: string, userId: string): Promise<Post | null>
  comment(postId: string, userId: string, text: string): Promise<Post | null>
  share(postId: string): Promise<Post | null>
  getEngagementCounts(postId: string): Promise<{ likes: number; comments: number; shares: number } | null>
}

import Entity from './entity'

export interface PostUser {
  id: string
  name?: string
}

export interface PostComment {
  id: string
  postId: string
  userId: string
  text: string
  createdAt: string
}

export default class Post extends Entity<Post> {
  id!: string
  userId!: string
  text!: string
  mediaRefs?: string[]
  createdAt!: string
  updatedAt!: string

  // Engagement counts (denormalized for performance)
  likesCount!: number
  commentsCount!: number
  sharesCount!: number

  // Engagement details (for retrieval)
  likedBy?: string[]
  comments?: PostComment[]
}

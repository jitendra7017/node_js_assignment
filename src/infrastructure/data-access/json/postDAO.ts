import * as fs from 'fs'
import * as path from 'path'
import { randomUUID } from 'crypto'
import { Post, PostComment } from '../../../entities'
import IPostDAO, {
  CursorPaginatedResult,
} from '../../../interfaces/post/postDAO'

const DATA_DIR = path.join(process.cwd(), 'data')
const POSTS_FILE = path.join(DATA_DIR, 'posts.json')

interface StoredPost {
  id: string
  userId: string
  text: string
  mediaRefs?: string[]
  createdAt: string
  updatedAt: string
  likesCount: number
  commentsCount: number
  sharesCount: number
  likedBy: string[]
  comments: PostComment[]
}

interface DataFile {
  posts: StoredPost[]
}

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function readData(): DataFile {
  ensureDataDir()
  if (!fs.existsSync(POSTS_FILE)) {
    return { posts: [] }
  }
  const raw = fs.readFileSync(POSTS_FILE, 'utf-8')
  return JSON.parse(raw) as DataFile
}

function writeData(data: DataFile): void {
  ensureDataDir()
  fs.writeFileSync(POSTS_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

function toPost(stored: StoredPost): Post {
  return new Post({
    id: stored.id,
    userId: stored.userId,
    text: stored.text,
    mediaRefs: stored.mediaRefs,
    createdAt: stored.createdAt,
    updatedAt: stored.updatedAt,
    likesCount: stored.likesCount,
    commentsCount: stored.commentsCount,
    sharesCount: stored.sharesCount,
    likedBy: stored.likedBy,
    comments: stored.comments,
  })
}

export default class JsonPostDAO implements IPostDAO {
  async create(payload: {
    userId: string
    text: string
    mediaRefs?: string[]
  }): Promise<Post> {
    const data = readData()
    const now = new Date().toISOString()
    const id = randomUUID()

    const stored: StoredPost = {
      id,
      userId: payload.userId,
      text: payload.text,
      mediaRefs: payload.mediaRefs ?? [],
      createdAt: now,
      updatedAt: now,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      likedBy: [],
      comments: [],
    }

    data.posts.unshift(stored)
    writeData(data)
    return toPost(stored)
  }

  async findById(id: string): Promise<Post | null> {
    const data = readData()
    const stored = data.posts.find((p) => p.id === id)
    return stored ? toPost(stored) : null
  }

  async getFeed(
    cursor: string | null,
    limit: number
  ): Promise<CursorPaginatedResult<Post>> {
    const data = readData()
    const posts = data.posts

    // Deterministic ordering: by createdAt desc, then by id for tie-breaker
    const sorted = [...posts].sort((a, b) => {
      const dateCmp = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (dateCmp !== 0) return dateCmp
      return b.id.localeCompare(a.id)
    })

    let startIndex = 0
    if (cursor) {
      const cursorIndex = sorted.findIndex((p) => p.id === cursor)
      if (cursorIndex >= 0) {
        startIndex = cursorIndex + 1
      }
    }

    const page = sorted.slice(startIndex, startIndex + limit)
    const hasMore = startIndex + limit < sorted.length
    const lastPost = page[page.length - 1]
    const nextCursor = hasMore && lastPost ? lastPost.id : null

    return {
      data: page.map(toPost),
      nextCursor,
      hasMore,
    }
  }

  async like(postId: string, userId: string): Promise<Post | null> {
    const data = readData()
    const post = data.posts.find((p) => p.id === postId)
    if (!post) return null
    if (post.likedBy.includes(userId)) return toPost(post)

    post.likedBy.push(userId)
    post.likesCount = post.likedBy.length
    post.updatedAt = new Date().toISOString()
    writeData(data)
    return toPost(post)
  }

  async unlike(postId: string, userId: string): Promise<Post | null> {
    const data = readData()
    const post = data.posts.find((p) => p.id === postId)
    if (!post) return null

    post.likedBy = post.likedBy.filter((id) => id !== userId)
    post.likesCount = post.likedBy.length
    post.updatedAt = new Date().toISOString()
    writeData(data)
    return toPost(post)
  }

  async comment(
    postId: string,
    userId: string,
    text: string
  ): Promise<Post | null> {
    const data = readData()
    const post = data.posts.find((p) => p.id === postId)
    if (!post) return null

    const comment: PostComment = {
      id: randomUUID(),
      postId,
      userId,
      text,
      createdAt: new Date().toISOString(),
    }
    post.comments.push(comment)
    post.commentsCount = post.comments.length
    post.updatedAt = new Date().toISOString()
    writeData(data)
    return toPost(post)
  }

  async share(postId: string): Promise<Post | null> {
    const data = readData()
    const post = data.posts.find((p) => p.id === postId)
    if (!post) return null

    post.sharesCount += 1
    post.updatedAt = new Date().toISOString()
    writeData(data)
    return toPost(post)
  }

  async getEngagementCounts(
    postId: string
  ): Promise<{ likes: number; comments: number; shares: number } | null> {
    const post = await this.findById(postId)
    if (!post) return null
    return {
      likes: post.likesCount,
      comments: post.commentsCount,
      shares: post.sharesCount,
    }
  }
}

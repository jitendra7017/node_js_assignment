import { JsonPostDAO } from '../infrastructure/data-access/json'
import MemoryCache from '../infrastructure/cache/memory-cache'
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

const postDAO = new JsonPostDAO()
const cache = new MemoryCache()

const useCases = {
  createPost: new CreatePost(postDAO, cache),
  viewPost: new ViewPost(postDAO, cache),
  postFeed: new PostFeed(postDAO, cache),
  likePost: new LikePost(postDAO, cache),
  unlikePost: new UnlikePost(postDAO, cache),
  commentPost: new CommentPost(postDAO, cache),
  sharePost: new SharePost(postDAO, cache),
  getEngagementCounts: new GetEngagementCounts(postDAO, cache),
}

export default {
  post: {
    DAO: JsonPostDAO,
    useCases,
  },
  cache,
}

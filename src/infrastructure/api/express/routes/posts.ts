import express, { NextFunction, Request, Response, Router } from 'express'
import { PostController } from '../../../../controllers'
import { services } from '../../../../config'

const { useCases } = services.post

const controller = new PostController(
  useCases.createPost,
  useCases.viewPost,
  useCases.postFeed,
  useCases.likePost,
  useCases.unlikePost,
  useCases.commentPost,
  useCases.sharePost,
  useCases.getEngagementCounts
)

const router: Router = express.Router()

function toRequest(req: Request) {
  return {
    params: req.params,
    query: req.query as Record<string, string | string[] | undefined>,
    headers: req.headers as Record<string, string | string[] | undefined>,
    body: req.body,
  }
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await controller.feed(toRequest(req))
    res.send(result)
  } catch (err) {
    return next(err)
  }
})

router.get('/:id/engagement', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await controller.engagement(toRequest(req))
    res.send(result)
  } catch (err) {
    return next(err)
  }
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await controller.view(toRequest(req))
    res.send(result)
  } catch (err) {
    return next(err)
  }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await controller.create(toRequest(req))
    res.send(result)
  } catch (err) {
    return next(err)
  }
})

router.post('/:id/like', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await controller.like(toRequest(req))
    res.send(result)
  } catch (err) {
    return next(err)
  }
})

router.post('/:id/unlike', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await controller.unlike(toRequest(req))
    res.send(result)
  } catch (err) {
    return next(err)
  }
})

router.post('/:id/comment', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await controller.comment(toRequest(req))
    res.send(result)
  } catch (err) {
    return next(err)
  }
})

router.post('/:id/share', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await controller.share(toRequest(req))
    res.send(result)
  } catch (err) {
    return next(err)
  }
})

export default router

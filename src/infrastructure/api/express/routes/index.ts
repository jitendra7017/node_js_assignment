import { Application } from 'express'
import posts from './posts'

export default {
  attach(app: Application): void {
    app.use('/posts', posts)
  },
}

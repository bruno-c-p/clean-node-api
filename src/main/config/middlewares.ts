import {
  bodyParser,
  contentTypeMiddleware,
  corsMiddleware,
} from "@/main/middlewares"
import type { Express } from "express"

export default (app: Express): void => {
  app.use(corsMiddleware)
  app.use(contentTypeMiddleware)
  app.use(bodyParser)
}

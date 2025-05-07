import type { Express } from "express"
import {
  bodyParser,
  contentTypeMiddleware,
  corsMiddleware,
} from "../middlewares"

export default (app: Express): void => {
  app.use(corsMiddleware)
  app.use(contentTypeMiddleware)
  app.use(bodyParser)
}

import type { Express } from "express"
import { bodyParser } from "../middlewares/body-parser"
import { contentTypeMiddleware } from "../middlewares/content-type"
import { corsMiddleware } from "../middlewares/cors"

export default (app: Express): void => {
  app.use(corsMiddleware)
  app.use(contentTypeMiddleware)
  app.use(bodyParser)
}

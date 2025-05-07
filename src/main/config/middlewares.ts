import type { Express } from "express"
import { bodyParser } from "../middlewares/body-parser"
import { corsMiddleware } from "../middlewares/cors"

export default (app: Express): void => {
  app.use(corsMiddleware)
  app.use(bodyParser)
}

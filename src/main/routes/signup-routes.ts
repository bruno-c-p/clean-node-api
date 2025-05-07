import type { Router } from "express"
import { routeAdapter } from "../adapters/express-route-adapter"
import { makeSignUpController } from "../factories/signup"

export default (router: Router): void => {
  router.post("/signup", routeAdapter(makeSignUpController()))
}

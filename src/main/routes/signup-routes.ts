import { routeAdapter } from "@/main/adapters/express-route-adapter"
import { makeSignUpController } from "@/main/factories/signup"
import type { Router } from "express"

export default (router: Router): void => {
  router.post("/signup", routeAdapter(makeSignUpController()))
}

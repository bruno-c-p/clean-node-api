import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "@/presentation/helpers"
import type {
  Authentication,
  Controller,
  HttpRequest,
  HttpResponse,
  Validator,
} from "./login-protocols"

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validator: Validator
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { email, password } = httpRequest.body

      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken) {
        return unauthorized()
      }

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}

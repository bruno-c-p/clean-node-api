import { InvalidParamError, MissingParamError } from "@/presentation/errors"
import { badRequest } from "@/presentation/helpers"
import type {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/presentation/protocols"
import type { EmailValidator } from "@/presentation/protocols/email-validator"

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return new Promise(resolve =>
        resolve(badRequest(new MissingParamError("email")))
      )
    }

    if (!httpRequest.body.password) {
      return new Promise(resolve =>
        resolve(badRequest(new MissingParamError("password")))
      )
    }

    this.emailValidator.isValid(httpRequest.body.email)
  }
}

import { badRequest, ok, serverError } from "@/presentation/helpers"
import type {
  AddAccount,
  Controller,
  HttpRequest,
  HttpResponse,
  Validator,
} from "./signup-protocols"

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validator: Validator
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const account = await this.addAccount.add({
        name: httpRequest.body.name,
        email: httpRequest.body.email,
        password: httpRequest.body.password,
      })

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}

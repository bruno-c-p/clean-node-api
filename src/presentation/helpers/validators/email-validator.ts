import { InvalidParamError } from "@/presentation/errors"
import type { EmailValidator as IEmailValidator } from "@/presentation/protocols/email-validator"
import type { Validator } from "../../protocols/validator"

export class EmailValidator implements Validator {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: IEmailValidator
  ) {}

  validate(input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
    return null
  }
}

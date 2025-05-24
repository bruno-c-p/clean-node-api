import { MissingParamError } from "@/presentation/errors"
import type { Validator } from "./validator"

export class RequiredFieldValidator implements Validator {
  constructor(private readonly fieldName: string) {}

  validate(input: any): Error {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
    return null
  }
}

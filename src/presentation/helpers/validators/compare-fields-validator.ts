import { InvalidParamError, MissingParamError } from "@/presentation/errors"
import type { Validator } from "../../protocols/validator"

export class CompareFieldsValidator implements Validator {
  constructor(
    private readonly fieldName: string,
    private readonly fieldNameToCompare: string
  ) {}

  validate(input: any): Error {
    if (input[this.fieldName] !== input[this.fieldNameToCompare]) {
      return new InvalidParamError(this.fieldNameToCompare)
    }
    return null
  }
}

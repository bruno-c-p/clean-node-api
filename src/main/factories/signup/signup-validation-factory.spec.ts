import {
  EmailValidator,
  RequiredFieldValidator,
  ValidatorComposite,
} from "@/presentation/helpers"
import type {
  EmailValidator as IEmailValidator,
  Validator,
} from "@/presentation/protocols"
import { makeLoginValidator } from "../login/login-validation-factory"

jest.mock("@/presentation/helpers/validators/validator-composite")

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe("LoginValidator Factory", () => {
  it("should call ValidationComposite with all validation", () => {
    makeLoginValidator()
    const validators: Validator[] = []

    for (const field of ["email", "password"]) {
      validators.push(new RequiredFieldValidator(field))
    }

    validators.push(new EmailValidator("email", makeEmailValidator()))

    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})

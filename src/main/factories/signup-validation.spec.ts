import { CompareFieldsValidator } from "@/presentation/helpers/validators/compare-fields-validator"
import { EmailValidator } from "@/presentation/helpers/validators/email-validator"
import { RequiredFieldValidator } from "@/presentation/helpers/validators/required-field-validator"
import { ValidatorComposite } from "@/presentation/helpers/validators/validator-composite"
import type { EmailValidator as IEmailValidator } from "@/presentation/protocols/email-validator"
import type { Validator } from "@/presentation/protocols/validator"
import { makeSignUpValidator } from "./signup-validation"

jest.mock("@/presentation/helpers/validators/validator-composite")

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe("SignUpValidator Factory", () => {
  it("should call ValidationComposite with all validation", () => {
    makeSignUpValidator()
    const validators: Validator[] = []

    for (const field of ["name", "email", "password", "passwordConfirmation"]) {
      validators.push(new RequiredFieldValidator(field))
    }

    validators.push(
      new CompareFieldsValidator("password", "passwordConfirmation")
    )

    validators.push(new EmailValidator("email", makeEmailValidator()))

    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})

import { CompareFieldsValidator } from "@/presentation/helpers/validators/compare-fields-validator"
import { RequiredFieldValidator } from "@/presentation/helpers/validators/required-field-validator"
import type { Validator } from "@/presentation/helpers/validators/validator"
import { ValidatorComposite } from "@/presentation/helpers/validators/validator-composite"
import { makeSignUpValidator } from "./signup-validation"

jest.mock("@/presentation/helpers/validators/validator-composite")

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

    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})

import {
  CompareFieldsValidator,
  EmailValidator,
  RequiredFieldValidator,
  ValidatorComposite,
} from "@/presentation/helpers/validators"
import type { Validator } from "@/presentation/protocols/validator"
import { EmailValidatorAdapter } from "@/utils/email-validator-adapter"

export const makeSignUpValidator = (): ValidatorComposite => {
  const validators: Validator[] = []

  for (const field of ["name", "email", "password", "passwordConfirmation"]) {
    validators.push(new RequiredFieldValidator(field))
  }

  validators.push(
    new CompareFieldsValidator("password", "passwordConfirmation")
  )

  validators.push(new EmailValidator("email", new EmailValidatorAdapter()))

  return new ValidatorComposite(validators)
}

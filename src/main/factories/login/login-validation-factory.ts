import { EmailValidatorAdapter } from "@/main/adapters/validators/email-validator-adapter"
import {
  EmailValidator,
  RequiredFieldValidator,
  ValidatorComposite,
} from "@/presentation/helpers"
import type { Validator } from "@/presentation/protocols"

export const makeLoginValidator = (): ValidatorComposite => {
  const validators: Validator[] = []

  for (const field of ["email", "password"]) {
    validators.push(new RequiredFieldValidator(field))
  }

  validators.push(new EmailValidator("email", new EmailValidatorAdapter()))

  return new ValidatorComposite(validators)
}

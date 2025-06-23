import { MissingParamError } from "@/presentation/errors"
import type { Validator } from "@/presentation/protocols/validator"
import { ValidatorComposite } from "./validator-composite"

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate(input: any): Error {
      return new MissingParamError("any_field")
    }
  }

  return new ValidatorStub()
}

const makeSut = (): ValidatorComposite => {
  return new ValidatorComposite([makeValidatorStub()])
}

describe("ValidatorComposite", () => {
  it("should return an error if the validation fails", () => {
    const sut = makeSut()
    const error = sut.validate({ any_field: "any_value" })
    expect(error).toEqual(new MissingParamError("any_field"))
  })
})

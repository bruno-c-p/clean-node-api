import { MissingParamError } from "@/presentation/errors"
import type { Validator } from "@/presentation/protocols/validator"
import { ValidatorComposite } from "./validator-composite"

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    validate(input: any): Error {
      return null
    }
  }

  return new ValidatorStub()
}

type SutTypes = {
  sut: ValidatorComposite
  validatorStub: Validator
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const sut = new ValidatorComposite([validatorStub])

  return {
    sut,
    validatorStub,
  }
}

describe("ValidatorComposite", () => {
  it("should return an error if the validation fails", () => {
    const { sut, validatorStub } = makeSut()
    jest
      .spyOn(validatorStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"))
    const error = sut.validate({ any_field: "any_value" })
    expect(error).toEqual(new MissingParamError("any_field"))
  })
})

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
  validatorStubs: Validator[]
}

const makeSut = (): SutTypes => {
  const validatorStubs = [makeValidatorStub(), makeValidatorStub()]
  const sut = new ValidatorComposite(validatorStubs)

  return {
    sut,
    validatorStubs,
  }
}

describe("ValidatorComposite", () => {
  it("should return an error if any validator fails", () => {
    const { sut, validatorStubs } = makeSut()
    jest
      .spyOn(validatorStubs[0], "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"))
    const error = sut.validate({ any_field: "any_value" })
    expect(error).toEqual(new MissingParamError("any_field"))
  })

  it("should return the first error if more than one validator fails", () => {
    const { sut, validatorStubs } = makeSut()
    jest.spyOn(validatorStubs[0], "validate").mockReturnValueOnce(new Error())
    jest
      .spyOn(validatorStubs[1], "validate")
      .mockReturnValueOnce(new MissingParamError("any_field2"))
    const error = sut.validate({ any_field: "any_value" })
    expect(error).toEqual(new Error())
  })

  it("should return null if all validators succeed", () => {
    const { sut } = makeSut()
    const error = sut.validate({ any_field: "any_value" })
    expect(error).toBeFalsy()
  })
})

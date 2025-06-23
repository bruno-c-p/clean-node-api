import { InvalidParamError } from "@/presentation/errors"
import { CompareFieldsValidator } from "./compare-fields-validator"

const makeSut = (): CompareFieldsValidator => {
  return new CompareFieldsValidator("any_field", "any_field2")
}

describe("CompareFields Validator", () => {
  it("should return a InvalidParamError if the validation fails", () => {
    const sut = makeSut()
    const error = sut.validate({
      any_field: "any_value",
      any_field2: "wrong_value",
    })
    expect(error).toEqual(new InvalidParamError("any_field2"))
  })

  it("should return null if the validation succeeds", () => {
    const sut = makeSut()
    const error = sut.validate({
      any_field: "any_value",
      any_field2: "any_value",
    })
    expect(error).toBeFalsy()
  })
})

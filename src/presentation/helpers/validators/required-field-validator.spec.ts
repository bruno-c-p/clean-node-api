import { MissingParamError } from "@/presentation/errors"
import { RequiredFieldValidator } from "./required-field-validator"

describe("RequiredField Validator", () => {
  it("should return a MissingParamError if the validation fails", () => {
    const sut = new RequiredFieldValidator("any_field")
    const error = sut.validate({})
    expect(error).toEqual(new MissingParamError("any_field"))
  })

  it("should return null if the validation succeeds", () => {
    const sut = new RequiredFieldValidator("any_field")
    const error = sut.validate({ any_field: "any_value" })
    expect(error).toBeNull()
  })
})

import { InvalidParamError } from "@/presentation/errors"
import type { EmailValidator } from "@/presentation/protocols/email-validator"
import { EmailValidator as EmailValidatorImpl } from "./email-validator"

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

type SutTypes = {
  sut: EmailValidatorImpl
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidatorImpl("email", emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe("EmailValidator", () => {
  it("should return an error if EmailValidator returns false", () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false)
    const error = sut.validate({ email: "any_email@any_email.com" })
    expect(error).toEqual(new InvalidParamError("email"))
  })

  it("should return null if EmailValidator returns true", () => {
    const { sut } = makeSut()
    const error = sut.validate({ email: "any_email@any_email.com" })
    expect(error).toBeNull()
  })

  it("Should call EmailValidator with correct email", () => {
    const { sut, emailValidatorStub } = makeSut()
    const validationSpy = jest.spyOn(emailValidatorStub, "isValid")
    sut.validate({ email: "any_email@any_email.com" })
    expect(validationSpy).toHaveBeenCalledWith("any_email@any_email.com")
  })

  it("should throw if EmailValidator throws", () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})

import { InvalidParamError, MissingParamError } from "@/presentation/errors"
import { badRequest, serverError } from "@/presentation/helpers"
import type { HttpRequest } from "@/presentation/protocols"
import type { EmailValidator } from "@/presentation/protocols/email-validator"
import { LoginController } from "./login"

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: "any_email",
    password: "any_password",
  },
})

type SutTypes = {
  sut: LoginController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub,
  }
}

describe("Login Controller", () => {
  it("should return 400 if email is not provided", async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: "any_password",
      },
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")))
  })

  it("should return 400 if password is not provided", async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: "any_email",
      },
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")))
  })

  it("should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid")
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith("any_email")
  })

  it("should return 400 if email is invalid", async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")))
  })

  it("should return 500 if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})

import { MissingParamError } from "@/presentation/errors"
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "@/presentation/helpers"
import { LoginController } from "./login"
import type {
  Authentication,
  AuthenticationModel,
  HttpRequest,
  Validator,
} from "./login-protocols"

const makeValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate(input: any): Error {
      return null
    }
  }

  return new ValidatorStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationModel): Promise<string> {
      return new Promise(resolve => resolve("any_token"))
    }
  }

  return new AuthenticationStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: "any_email",
    password: "any_password",
  },
})

type SutTypes = {
  sut: LoginController
  authenticationStub: Authentication
  validatorStub: Validator
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication()
  const validatorStub = makeValidator()
  const sut = new LoginController(authenticationStub, validatorStub)

  return {
    sut,
    authenticationStub,
    validatorStub,
  }
}

describe("Login Controller", () => {
  it("should call Authentication with correct credentials", async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, "auth")
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({
      email: "any_email",
      password: "any_password",
    })
  })

  it("should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut()
    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  it("should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut()
    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(new Promise((_, reject) => reject(new Error())))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it("should return 200 if valid credentials are provided", async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(
      ok({
        accessToken: "any_token",
      })
    )
  })

  it("should call Validation with correct value", async () => {
    const { sut, validatorStub } = makeSut()
    const validationSpy = jest.spyOn(validatorStub, "validate")
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it("should return 400 if Validation returns an error", async () => {
    const { sut, validatorStub } = makeSut()
    jest
      .spyOn(validatorStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError("any_field")))
  })
})

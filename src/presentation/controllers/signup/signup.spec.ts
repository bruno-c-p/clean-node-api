import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "@/presentation/errors"
import { badRequest, ok, serverError } from "@/presentation/helpers"
import { SignUpController } from "./signup"
import type {
  AccountModel,
  AddAccount,
  AddAccountModel,
  EmailValidator,
  HttpRequest,
  Validator,
} from "./signup-protocols"

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

const makeValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate(input: any): Error {
      return null
    }
  }
  return new ValidatorStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email",
  password: "valid_password",
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@any_email.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
})

type SutTypes = {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
  validationStub: Validator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidator()
  const sut = new SignUpController(
    emailValidatorStub,
    addAccountStub,
    validationStub
  )
  return { sut, emailValidatorStub, addAccountStub, validationStub }
}

describe("SignUp Controller", () => {
  it("Should return 400 if password confirmation does not match password", async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        password: "any_password",
        passwordConfirmation: "any_password_confirmation",
      },
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError("passwordConfirmation"))
    )
  })

  it("Should return 400 if an invalid email is provided", async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")))
  })

  it("Should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid")
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith("any_email@any_email.com")
  })

  it("Should return 500 if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new ServerError()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it("Should call AddAccount with correct values", async () => {
    const { sut, addAccountStub } = makeSut()
    const addAccountSpy = jest.spyOn(addAccountStub, "add")
    await sut.handle(makeFakeRequest())
    expect(addAccountSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@any_email.com",
      password: "any_password",
    })
  })

  it("Should return 500 if AddAccount throws", async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, "add").mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new ServerError()))
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it("Should return 200 if valid data is provided", async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  it("should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut()
    const validationSpy = jest.spyOn(validationStub, "validate")
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it("should return 400 if Validation returns an error", async () => {
    const { sut, validationStub } = makeSut()
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError("any_field")))
  })
})

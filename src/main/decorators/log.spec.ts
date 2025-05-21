import type { LogErrorRepository } from "@/data/protocols/log-error-repository"
import type { AccountModel } from "@/domain/models/account"
import { ok, serverError } from "@/presentation/helpers"
import type {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/presentation/protocols"
import { LogControllerDecorator } from "./log"

const makeController = () => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise(resolve => resolve(ok(makeFakeAccount())))
    }
  }

  return new ControllerStub()
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }

  return new LogErrorRepositoryStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@any_email.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
})

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email",
  password: "valid_password",
})

const makeFakeError = (): HttpResponse => {
  const error = new Error()
  error.stack = "any_stack"
  return serverError(error)
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return { sut, controllerStub, logErrorRepositoryStub }
}

describe("LogControllerDecorator", () => {
  it("should call controller handle", async () => {
    const { controllerStub, sut } = makeSut()
    const spyHandle = jest.spyOn(controllerStub, "handle")
    await sut.handle(makeFakeRequest())
    expect(spyHandle).toHaveBeenCalledWith(makeFakeRequest())
  })

  it("should return the same result as the controller", async () => {
    const { controllerStub, sut } = makeSut()
    const spyHandle = jest.spyOn(controllerStub, "handle")
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
    expect(spyHandle).toHaveBeenCalledWith(makeFakeRequest())
  })

  it("should return the same result as the controller", async () => {
    const { controllerStub, sut } = makeSut()
    const spyHandle = jest.spyOn(controllerStub, "handle")
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
    expect(spyHandle).toHaveBeenCalledWith(makeFakeRequest())
  })

  it("should call LogErrorRepository with correct error if controller returns a server error", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = makeFakeError()
    const logSpy = jest.spyOn(logErrorRepositoryStub, "logError")
    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValueOnce(new Promise(resolve => resolve(fakeError)))
    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith("any_stack")
  })
})

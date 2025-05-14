import type { LogErrorRepository } from "../../data/protocols/log-error-repository"
import { serverError } from "../../presentation/helpers"
import type {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols"
import { LogControllerDecorator } from "./log"

const makeController = () => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {},
      }
      return new Promise(resolve => resolve(httpResponse))
    }
  }

  return new ControllerStub()
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {
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
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(spyHandle).toHaveBeenCalledWith(httpRequest)
  })

  it("should return the same result as the controller", async () => {
    const { controllerStub, sut } = makeSut()
    const spyHandle = jest.spyOn(controllerStub, "handle")
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {},
    })
    expect(spyHandle).toHaveBeenCalledWith(httpRequest)
  })

  it("should return the same result as the controller", async () => {
    const { controllerStub, sut } = makeSut()
    const spyHandle = jest.spyOn(controllerStub, "handle")
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {},
    })
    expect(spyHandle).toHaveBeenCalledWith(httpRequest)
  })

  it("should call LogErrorRepository with correct error if controller returns a server error", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = "any_stack"
    const error = serverError(fakeError)
    const logSpy = jest.spyOn(logErrorRepositoryStub, "log")
    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValueOnce(new Promise(resolve => resolve(error)))
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith("any_stack")
  })
})

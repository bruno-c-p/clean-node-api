import type {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols"
import { LogControllerDecorator } from "./log"

describe("LogControllerDecorator", () => {
  it("should call controller handle", async () => {
    class ControllerStub implements Controller {
      async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
          statusCode: 200,
          body: {},
        }
        return new Promise(resolve => resolve(httpResponse))
      }
    }
    const controllerStub = new ControllerStub()
    const spyHandle = jest.spyOn(controllerStub, "handle")
    const sut = new LogControllerDecorator(controllerStub)
    const httpRequest: HttpRequest = {
      body: {
        name: "any_name",
        email: "any_email@any_email.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    }
    await sut.handle(httpRequest)
    expect(spyHandle).toHaveBeenCalledWith(httpRequest)
  })

  it("should return http response", async () => {
    class ControllerStub implements Controller {
      async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
          statusCode: 200,
          body: {},
        }
        return new Promise(resolve => resolve(httpResponse))
      }
    }
    const controllerStub = new ControllerStub()
    const sut = new LogControllerDecorator(controllerStub)
    const httpRequest: HttpRequest = {
      body: {
        name: "any_name",
        email: "any_email@any_email.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {},
    })
  })
})

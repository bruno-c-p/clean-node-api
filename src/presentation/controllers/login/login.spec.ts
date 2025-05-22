import { MissingParamError } from "@/presentation/errors"
import { badRequest } from "@/presentation/helpers"
import { LoginController } from "./login"

type SutTypes = {
  sut: LoginController
}

const makeSut = (): SutTypes => {
  const sut = new LoginController()

  return {
    sut,
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
})

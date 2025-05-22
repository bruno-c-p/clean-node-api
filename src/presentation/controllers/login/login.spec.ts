import { MissingParamError } from "@/presentation/errors"
import { badRequest } from "@/presentation/helpers"
import { LoginController } from "./login"

describe("Login Controller", () => {
  it("should return 400 if email is not provided", async () => {
    const sut = new LoginController()
    const httpRequest = {
      body: {
        password: "any_password",
      },
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")))
  })

  it("should return 400 if password is not provided", async () => {
    const sut = new LoginController()
    const httpRequest = {
      body: {
        email: "any_email",
      },
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")))
  })
})

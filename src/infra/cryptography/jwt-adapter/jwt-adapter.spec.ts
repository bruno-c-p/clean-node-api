import jwt from "jsonwebtoken"
import { JwtAdapter } from "./jwt-adapter"

jest.mock("jsonwebtoken", () => ({
  async sign(): Promise<string> {
    return new Promise(resolve => resolve("any_token"))
  },
}))

describe("JWTAdapter", () => {
  it("should call jwt.sign with correct values", async () => {
    const sut = new JwtAdapter("secret")
    const signSpy = jest.spyOn(jwt, "sign")
    await sut.encrypt("any_id")
    expect(signSpy).toHaveBeenCalledWith({ id: "any_id" }, "secret")
  })

  it("should return a token on success", async () => {
    const sut = new JwtAdapter("secret")
    const accessToken = await sut.encrypt("any_id")
    expect(accessToken).toBe("any_token")
  })

  it("should throw if jwt.sign throws", async () => {
    const sut = new JwtAdapter("secret")
    jest.spyOn(jwt, "sign").mockImplementationOnce(() => {
      throw new Error("any_error")
    })
    expect(sut.encrypt("any_id")).rejects.toThrow("any_error")
  })
})

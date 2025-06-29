import type { HashComparer } from "@/data/protocols/criptography/hash-comparer"
import type { TokenGenerator } from "@/data/protocols/criptography/token-generator"
import type { LoadAccountByEmailRepository } from "@/data/protocols/db/account/load-account-by-email-repository"
import type { UpdateAccessTokenRepository } from "@/data/protocols/db/account/update-access-token-repository"
import type { AuthenticationModel } from "@/domain/usecases/authentication"
import type { AccountModel } from "./db-add-account-protocols"
import { DbAuthentication } from "./db-authentication"

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@any_email.com",
  password: "hashed_password",
})

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: "any_email@any_email.com",
  password: "any_password",
})

const makeLoadAccountByEmailRepositoryStub =
  (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub
      implements LoadAccountByEmailRepository
    {
      async load(email: string): Promise<AccountModel> {
        return new Promise(resolve => resolve(makeFakeAccount()))
      }
    }
    return new LoadAccountByEmailRepositoryStub()
  }

const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new HashComparerStub()
}

const makeTokenGeneratorStub = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return new Promise(resolve => resolve("any_token"))
    }
  }
  return new TokenGeneratorStub()
}

const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update(id: string, token: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub =
    makeLoadAccountByEmailRepositoryStub()
  const hashComparerStub = makeHashComparerStub()
  const tokenGeneratorStub = makeTokenGeneratorStub()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub,
  }
}

describe("DbAuthentication UseCase", () => {
  it("should call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "load")
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith("any_email@any_email.com")
  })

  it("shoud throw if LoadAccountByEmailRepository throws", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "load")
      .mockImplementationOnce(() => {
        throw new Error()
      })
    await expect(sut.auth(makeFakeAuthentication())).rejects.toThrow(
      new Error()
    )
  })

  it("should return null if LoadAccountByEmailRepository returns null", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "load")
      .mockReturnValueOnce(null)
    const result = await sut.auth(makeFakeAuthentication())
    expect(result).toBeNull()
  })

  it("should call HashComparer with correct values", async () => {
    const { sut, hashComparerStub } = makeSut()
    const hashComparerSpy = jest.spyOn(hashComparerStub, "compare")
    await sut.auth(makeFakeAuthentication())
    expect(hashComparerSpy).toHaveBeenCalledWith(
      "any_password",
      "hashed_password"
    )
  })

  it("should throw if HashComparer throws", async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, "compare").mockImplementationOnce(() => {
      throw new Error()
    })
    await expect(sut.auth(makeFakeAuthentication())).rejects.toThrow(
      new Error()
    )
  })

  it("should return null if HashComparer returns false", async () => {
    const { sut, hashComparerStub } = makeSut()
    jest
      .spyOn(hashComparerStub, "compare")
      .mockReturnValueOnce(Promise.resolve(false))
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  it("should call TokenGenerator with correct id", async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const tokenGeneratorSpy = jest.spyOn(tokenGeneratorStub, "generate")
    await sut.auth(makeFakeAuthentication())
    expect(tokenGeneratorSpy).toHaveBeenCalledWith("any_id")
  })

  it("should throw if TokenGenerator throws", async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, "generate").mockImplementationOnce(() => {
      throw new Error()
    })
    await expect(sut.auth(makeFakeAuthentication())).rejects.toThrow(
      new Error()
    )
  })

  it("should return a token on success", async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBe("any_token")
  })

  it("should call UpdateAccessTokenRepository with correct values", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, "update")
    await sut.auth(makeFakeAuthentication())
    expect(updateSpy).toHaveBeenCalledWith("any_id", "any_token")
  })

  it("should throw if UpdateAccessTokenRepository throws", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest
      .spyOn(updateAccessTokenRepositoryStub, "update")
      .mockImplementationOnce(() => {
        throw new Error()
      })
    await expect(sut.auth(makeFakeAuthentication())).rejects.toThrow(
      new Error()
    )
  })
})

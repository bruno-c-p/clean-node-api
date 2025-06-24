import type { HashComparer } from "@/data/protocols/criptography/hash-comparer"
import type { LoadAccountByEmailRepository } from "@/data/protocols/db/load-account-by-email-repository"
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

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub =
    makeLoadAccountByEmailRepositoryStub()
  const hashComparerStub = makeHashComparerStub()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub
  )
  return { sut, loadAccountByEmailRepositoryStub, hashComparerStub }
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
})

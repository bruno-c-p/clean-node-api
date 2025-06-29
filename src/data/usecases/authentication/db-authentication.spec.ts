import { DbAuthentication } from "./db-authentication"
import type {
  AccountModel,
  AuthenticationModel,
  Encrypter,
  HashComparer,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from "./db-authentication-protocols"

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

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(id: string): Promise<string> {
      return new Promise(resolve => resolve("any_token"))
    }
  }
  return new EncrypterStub()
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
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub =
    makeLoadAccountByEmailRepositoryStub()
  const hashComparerStub = makeHashComparerStub()
  const encrypterStub = makeEncrypterStub()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
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

  it("should call Encrypter with correct id", async () => {
    const { sut, encrypterStub } = makeSut()
    const encrypterSpy = jest.spyOn(encrypterStub, "encrypt")
    await sut.auth(makeFakeAuthentication())
    expect(encrypterSpy).toHaveBeenCalledWith("any_id")
  })

  it("should throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, "encrypt").mockImplementationOnce(() => {
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

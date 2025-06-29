import type {
  Authentication,
  AuthenticationModel,
  Encrypter,
  HashComparer,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from "./db-authentication-protocols"

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email
    )

    if (!account) {
      return null
    }

    const isValidPassword = await this.hashComparer.compare(
      authentication.password,
      account.password
    )

    if (!isValidPassword) {
      return null
    }

    const accessToken = await this.tokenGenerator.encrypt(account.id)

    await this.updateAccessTokenRepository.update(account.id, accessToken)

    return accessToken
  }
}

import type { HashComparer } from "@/data/protocols/criptography/hash-comparer"
import type { TokenGenerator } from "@/data/protocols/criptography/token-generator"
import type { LoadAccountByEmailRepository } from "@/data/protocols/db/load-account-by-email-repository"
import type {
  Authentication,
  AuthenticationModel,
} from "@/domain/usecases/authentication"

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
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

    const accessToken = await this.tokenGenerator.generate(account.id)
    return accessToken
  }
}

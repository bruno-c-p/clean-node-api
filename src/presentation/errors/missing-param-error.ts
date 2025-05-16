export class MissingParamError extends Error {
  constructor(param: string) {
    super(`Missing param: ${param}`)
    this.name = "MissingParamError"
    this.message = `Missing param: ${param}`
  }
}

import type { NextFunction, Request, Response } from "express"

export const contentTypeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.type("application/json")
  next()
}

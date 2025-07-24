import { NextFunction, Request, Response } from "express";
import { ValidateUser } from "../utils";

export const RequestAuthorizer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      throw new Error("Unauthorized due to authorization token missing!");
    }

    const data = await ValidateUser(req.headers.authorization as string);
    req.user = data;
    next();
  } catch (error) {
    res.status(403).json({ error });
  }
};

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "hfjfhskdjfhkh";
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"] ?? "";

  try {
    const decoded = jwt.verify(authHeader, JWT_SECRET);

    // @ts-ignore
    if (decoded.userId) {
        // @ts-ignore
        req.userId = decoded.userId
        return next();
    }
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return next();
  }
}

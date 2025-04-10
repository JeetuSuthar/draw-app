import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { Request as ExpressRequest } from "express";

// 1. Extend the Request type
interface AuthenticatedRequest extends ExpressRequest {
  userId?: number;
}

export function middleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.headers["authorization"] ?? "";

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    req.userId = decoded.userId;  // No more @ts-ignore needed ✅
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(403).json({
      message: "Unauthorized"
    });
  }
}

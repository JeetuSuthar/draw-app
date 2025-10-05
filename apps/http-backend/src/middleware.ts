import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { Request as ExpressRequest } from "express";

// Change userId type from number to string to match your UUID schema
interface AuthenticatedRequest extends ExpressRequest {
  userId?: string; // Changed from number to string
}

export function middleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.headers["authorization"] || "EMPTY TOKEN";

  try {
    // Change the type assertion to string
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(403).json({
      message: "Unauthorized"
    });
  }
}

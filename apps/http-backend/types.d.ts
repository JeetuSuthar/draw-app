import "express"
declare global {
  namespace Express {
    export interface Request {
      userID?: string;
    }
  }
}
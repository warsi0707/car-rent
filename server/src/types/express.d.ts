import "express";

declare global {
  namespace Express {
    interface Request {
      admin?: string;
    }
  }
}
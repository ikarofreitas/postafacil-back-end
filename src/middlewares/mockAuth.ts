import { Request, Response, NextFunction } from "express";

export function mockAuth(req: Request, res: Response, next: NextFunction) {
  req.user = {
    id: "697ca58d8498b19f7fa2dfe1" // ObjectId REAL do Mongo
  };
  next();
}

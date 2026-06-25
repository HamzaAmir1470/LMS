import {type Request, type Response, type NextFunction } from "express";

export const CatchAsyncErrors =
  (theFunc: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
  };

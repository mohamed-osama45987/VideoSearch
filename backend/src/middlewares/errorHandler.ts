import { NextFunction, Request, Response } from 'express';

export interface IError {
  statusCode?: number;
  message: string;
}


export const errorHandler = (err: IError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode ? err.statusCode : 500;
  res.status(statusCode);
  res.status(statusCode).send({
    message: err.message,
  });
};

export default errorHandler;

import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { StatusCode } from '../shared/constants/statusCode';

export const validate = (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const details = error.details.map((d) => d.message);
    res.status(StatusCode.BAD_REQUEST).json({ message: details[0]});
    return ;
  }

  next();
};

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { PRIVATE_KEY } from '../lib/consts';

export default async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.authorization;

    if (!token) throw new Error('Missing credentials');

    const verified = jwt.verify(token, PRIVATE_KEY);
    req.$user = verified;
    next();
  } catch (error: any) {
    res.status(401).json({ success: false, message: error?.message });
  }
}

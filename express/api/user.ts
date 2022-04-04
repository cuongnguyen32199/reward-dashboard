import jwt from 'jsonwebtoken';
import { Router, Request, Response, NextFunction } from 'express';

import auth from './../middlewares/auth';
import { PRIVATE_KEY } from '../lib/consts';
import * as usersController from './../controllers/user.controller';

const router = Router();

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const user = await usersController.login(data);

    const encoded = jwt.sign({ email: user.email }, PRIVATE_KEY, { expiresIn: '1d' });
    res.cookie('authorization', encoded);

    return res.redirect('/');
  } catch (error: any) {
    return res.redirect('/login');
  }
});

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = req.body;

    const user = await usersController.create(params);

    return res.json({ success: true, data: user });
  } catch (error: any) {
    return res.json({ success: false, message: error?.message });
  }
});

router.get('/verify/:token', async (req: Request, res: Response) => {
  try {
    const token = req.params?.token;
    if (!token) throw new Error('Missing credentials');

    const verified = jwt.verify(token, PRIVATE_KEY);

    return res.json({ success: true, payload: verified });
  } catch (error: any) {
    return res.json({ success: false, message: error?.message || 'Token expired' });
  }
});

router.get('/logout', async (req: Request, res: Response) => {
  try {
    return res.cookie('authorization', undefined).redirect('/login');
  } catch (error: any) {
    return res.redirect('/login');
  }
});

router.use(auth);

router.get('/', async (_: Request, res: Response) => {
  try {
    const users = await usersController.filter();

    return res.json({ success: true, data: users });
  } catch (error: any) {
    return res.json({ success: false, message: error?.message });
  }
});

export default router;

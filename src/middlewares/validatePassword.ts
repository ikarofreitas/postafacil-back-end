import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  body: {
    email?: string;
    password?: string;
  };
}

export function validatePassword(req: AuthRequest, res: Response, next: NextFunction) {
  const { password } = req.body;

  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres.' });
  }

  next();
}
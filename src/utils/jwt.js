import jwt from 'jsonwebtoken';
import 'dotenv/config';

export function signJwt(payload, options = {}) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured in environment');
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn, ...options });
}

export function verifyJwt(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured in environment');
  }
  return jwt.verify(token, secret);
}
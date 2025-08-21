import { verifyJwt } from '../utils/jwt.js';

export function authMiddleware(requiredRoles = []) {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || '';
      const [, token] = authHeader.split(' ');
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const payload = verifyJwt(token);
      req.user = payload;
      if (requiredRoles.length && !requiredRoles.includes(payload.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}


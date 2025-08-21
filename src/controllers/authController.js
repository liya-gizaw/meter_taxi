import { validationResult } from 'express-validator';
import { userService } from '../services/userService.js';

export const authController = {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password, role, language } = req.body;
      const result = await userService.registerWithEmail({ email, password, role, language });
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      const result = await userService.loginWithEmail({ email, password });
      return res.json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};


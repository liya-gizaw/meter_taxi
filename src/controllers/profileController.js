import { validationResult } from 'express-validator';
import { userService } from '../services/userService.js';

export const profileController = {
  async me(req, res) {
    const profile = await userService.getProfile(req.user.id);
    return res.json({ profile });
  },

  async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const profile = await userService.updateProfile(req.user.id, req.body);
      return res.json({ profile });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};


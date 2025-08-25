import { validationResult } from 'express-validator';
import { userService } from '../services/userService.js';

export const authController = {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password, role } = req.body;
      const result = await userService.registerWithEmail({ email, password, role });
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

  async registerPhone(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { phone, password, role, language } = req.body;
      const result = await userService.registerWithPhone({ phone, password, role, language });
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  async loginPhone(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { phone, password } = req.body;
      const result = await userService.loginWithPhone({ phone, password });
      return res.json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  async socialLogin(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { provider, externalId, email, phone, role, language } = req.body;
      const result = await userService.loginWithSocial({ provider, externalId, email, phone, role});
      return res.json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  async me(req, res) {
    try {
      const user = await userService.getUserById(req.user.id);
      if (!user) return res.status(404).json({ message: 'Not found' });
      const safeUser = {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        is_active: user.is_active,
        availability: user.availability,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
      return res.json({ user: safeUser });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  async updateMe(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, phone, password } = req.body;
      const updated = await userService.updateUserById(req.user.id, { email, phone, password });
      const safeUser = {
        id: updated.id,
        email: updated.email,
        phone: updated.phone,
        role: updated.role,
        is_active: updated.is_active,
        availability: updated.availability,
        created_at: updated.created_at,
        updated_at: updated.updated_at,
      };
      return res.json({ user: safeUser });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  async deleteMe(req, res) {
    try {
      await userService.deleteUserById(req.user.id);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  // Admin: get all users (paged) and get by id
  async listUsers(req, res) {
    try {
      const { limit, offset } = req.query;
      const result = await userService.listUsers({ limit, offset });
      return res.json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  async getUserById(req, res) {
    try {
      const user = await userService.adminGetUserById(req.params.id);
      if (!user) return res.status(404).json({ message: 'Not found' });
      return res.json(user);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};

import { query, body, param, validationResult } from 'express-validator';
import { userService } from '../services/userService.js';
import { profileService } from '../services/profileService.js';

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

  // Admin-style handlers (permissions enforced at route layer)
  async list(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { limit, offset } = req.query;
    const data = await profileService.list({ limit, offset });
    return res.json(data);
  },

  async get(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const item = await profileService.getById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    return res.json(item);
  },

  async create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const item = await profileService.create(req.body);
    return res.status(201).json(item);
  },

  async adminUpdate(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const item = await profileService.update(req.params.id, req.body);
    if (!item) return res.status(404).json({ message: 'Not found' });
    return res.json(item);
  },

  async remove(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    await profileService.remove(req.params.id);
    return res.status(204).send();
  },
};

export const profileValidations = {
  // self update validation stays at routes level; admin ones here
  list: [query('limit').optional().toInt(), query('offset').optional().toInt()],
  create: [
    body('user_id').isInt().toInt(),
    body('first_name').optional().isString(),
    body('last_name').optional().isString(),
    body('gender').optional().isIn(['male','female']),
    body('dob').optional().isISO8601(),
    body('emergency_contact').optional(),
    body('documents').optional(),
  ],
  update: [
    param('id').isInt().toInt(),
    body('first_name').optional().isString(),
    body('last_name').optional().isString(),
    body('gender').optional().isIn(['male','female']),
    body('dob').optional().isISO8601(),
    body('emergency_contact').optional(),
    body('documents').optional(),
  ],
  get: [param('id').isInt().toInt()],
  remove: [param('id').isInt().toInt()],
};


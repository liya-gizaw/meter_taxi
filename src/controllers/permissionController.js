import { body, param, validationResult } from 'express-validator';
import { permissionService } from '../services/permissionService.js';

export const permissionValidations = {
  create: [body('key').isString().isLength({ min: 2, max: 100 }), body('description').optional().isString()],
  grant: [param('role').isIn(['passenger', 'driver', 'dispatcher', 'admin', 'finance']), body('key').isString()],
  revoke: [param('role').isIn(['passenger', 'driver', 'dispatcher', 'admin', 'finance']), body('key').isString()],
};

export const permissionController = {
  async create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const perm = await permissionService.createPermission(req.body);
    return res.status(201).json(perm);
  },
  async list(req, res) {
    const items = await permissionService.listPermissions();
    return res.json(items);
  },
  async grant(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { role } = req.params;
    const { key } = req.body;
    await permissionService.grantPermissionToRole(role, key);
    return res.status(204).send();
  },
  async revoke(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { role } = req.params;
    const { key } = req.body;
    await permissionService.revokePermissionFromRole(role, key);
    return res.status(204).send();
  },
  async listRole(req, res) {
    const { role } = req.params;
    const keys = await permissionService.listRolePermissions(role);
    return res.json({ role, permissions: keys });
  },
};

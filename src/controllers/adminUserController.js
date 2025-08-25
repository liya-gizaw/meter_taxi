import { query, body, param, validationResult } from 'express-validator';
import { adminUserService } from '../services/adminUserService.js';

export const adminUserValidations = {
	list: [query('limit').optional().toInt(), query('offset').optional().toInt()],
	create: [
		body('email').optional().isEmail(),
		body('phone').optional().isString(),
		body('role').optional().isIn(['passenger','driver','dispatcher','admin','finance']),
		body('password').optional().isLength({ min: 6 }),
		body('is_active').optional().isBoolean()
	],
	update: [
		param('id').isInt().toInt(),
		body('email').optional().isEmail(),
		body('phone').optional().isString(),
		body('role').optional().isIn(['passenger','driver','dispatcher','admin','finance']),
		body('password').optional().isLength({ min: 6 }),
		body('is_active').optional().isBoolean()
	],
	get: [param('id').isInt().toInt()],
	remove: [param('id').isInt().toInt()],
};

export const adminUserController = {
	async list(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		const { limit, offset } = req.query;
		const data = await adminUserService.list({ limit, offset });
		return res.json(data);
	},
	async get(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		const item = await adminUserService.getById(req.params.id);
		if (!item) return res.status(404).json({ message: 'Not found' });
		return res.json(item);
	},
	async create(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		const item = await adminUserService.create(req.body);
		return res.status(201).json(item);
	},
	async update(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		const item = await adminUserService.update(req.params.id, req.body);
		if (!item) return res.status(404).json({ message: 'Not found' });
		return res.json(item);
	},
	async remove(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		await adminUserService.remove(req.params.id);
		return res.status(204).send();
	},
};
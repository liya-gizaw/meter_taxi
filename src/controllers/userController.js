import { query, body, param, validationResult } from 'express-validator';
import { userService } from '../services/userService.js';

export const userValidations = {
	availability: [body('availability').isIn(['online','offline'])],
	// Admin-style
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

export const userController = {
	async setAvailability(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		const { availability } = req.body;
		try {
			const result = await userService.setAvailability(req.user.id, availability);
			return res.json(result);
		} catch (e) {
			return res.status(400).json({ message: e.message });
		}
	},

	// Admin-style handlers (permissions enforced at route layer)
	async list(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		const { limit, offset } = req.query;
		const data = await userService.listUsers({ limit, offset });
		return res.json(data);
	},

	async get(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		const item = await userService.adminGetUserById(req.params.id);
		if (!item) return res.status(404).json({ message: 'Not found' });
		return res.json(item);
	},

	async create(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		const item = await userService.adminCreateUser(req.body);
		return res.status(201).json(item);
	},

	async update(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		const item = await userService.adminUpdateUser(req.params.id, req.body);
		if (!item) return res.status(404).json({ message: 'Not found' });
		return res.json(item);
	},

	async remove(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		await userService.adminRemoveUser(req.params.id);
		return res.status(204).send();
	},
};
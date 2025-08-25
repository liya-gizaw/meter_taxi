import { query, body, param, validationResult } from 'express-validator';
import { adminProfileService } from '../services/adminProfileService.js';

export const adminProfileValidations = {
	list: [query('limit').optional().toInt(), query('offset').optional().toInt()],
	create: [
		body('user_id').isInt().toInt(),
		body('first_name').optional().isString(),
		body('last_name').optional().isString(),
		body('gender').optional().isIn(['male','female']),
		body('dob').optional().isISO8601(),
		body('emergency_contact').optional(),
		body('documents').optional()
	],
	update: [
		param('id').isInt().toInt(),
		body('first_name').optional().isString(),
		body('last_name').optional().isString(),
		body('gender').optional().isIn(['male','female',]),
		body('dob').optional().isISO8601(),
		body('emergency_contact').optional(),
		body('documents').optional()
	],
	get: [param('id').isInt().toInt()],
	remove: [param('id').isInt().toInt()],
};

export const adminProfileController = {
	async list(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		const { limit, offset } = req.query;
		const data = await adminProfileService.list({ limit, offset });
		return res.json(data);
	},
	async get(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		const item = await adminProfileService.getById(req.params.id);
		if (!item) return res.status(404).json({ message: 'Not found' });
		return res.json(item);
	},
	async create(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		const item = await adminProfileService.create(req.body);
		return res.status(201).json(item);
	},
	async update(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		const item = await adminProfileService.update(req.params.id, req.body);
		if (!item) return res.status(404).json({ message: 'Not found' });
		return res.json(item);
	},
	async remove(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		await adminProfileService.remove(req.params.id);
		return res.status(204).send();
	},
};
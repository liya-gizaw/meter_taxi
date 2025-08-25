import { body, validationResult } from 'express-validator';
import { userService } from '../services/userService.js';

export const userValidations = {
	availability: [body('availability').isIn(['online','offline'])],
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
};
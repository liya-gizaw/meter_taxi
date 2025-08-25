import { body, param, validationResult } from 'express-validator';
import { Rating } from '../models/associations.js';

export const ratingValidations = {
	create: [body('ratee_user_id').isInt().toInt(), body('score').isInt({ min: 1, max: 5 }).toInt(), body('comment').optional().isString()],
	listForUser: [param('userId').isInt().toInt()],
};

export const ratingController = {
	async create(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		const { ratee_user_id, score, comment } = req.body;
		const rating = await Rating.create({ rater_user_id: req.user.id, ratee_user_id, score, comment });
		return res.status(201).json({ id: rating.id, score: rating.score, comment: rating.comment });
	},
	async listForUser(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		const items = await Rating.findAll({ where: { ratee_user_id: req.params.userId } });
		return res.json(items);
	},
};

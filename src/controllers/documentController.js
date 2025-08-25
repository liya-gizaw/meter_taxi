import multer from 'multer';
import { body, param, validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs';
import { UserDocument } from '../models/associations.js';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const dir = path.join('public', 'uploads');
		if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
		cb(null, dir);
	},
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
	}
});

export const upload = multer({ storage });

export const documentValidations = {
	upload: [body('type').isIn(['id_card','driver_license','vehicle_registration','insurance','other']).withMessage('Invalid type')],
	review: [param('id').isInt().toInt(), body('status').isIn(['approved','rejected']), body('review_note').optional().isString()],
};

export const documentController = {
	async upload(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		if (!req.file) return res.status(400).json({ message: 'File is required' });
		const doc = await UserDocument.create({ user_id: req.user.id, type: req.body.type, file_path: req.file.path, status: 'pending' });
		return res.status(201).json({ id: doc.id, type: doc.type, file_path: doc.file_path, status: doc.status });
	},
	async listMine(req, res) {
		const docs = await UserDocument.findAll({ where: { user_id: req.user.id } });
		return res.json(docs);
	},
	async review(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		const doc = await UserDocument.findByPk(req.params.id);
		if (!doc) return res.status(404).json({ message: 'Not found' });
		doc.status = req.body.status;
		doc.review_note = req.body.review_note ?? null;
		doc.reviewed_by = req.user.id;
		doc.reviewed_at = new Date();
		await doc.save();
		return res.json({ id: doc.id, status: doc.status, review_note: doc.review_note });
	},
};

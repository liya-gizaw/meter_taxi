import { UserDocument } from '../../models/associations.js';

export async function addDocumentToUser(userId, { type, file_path, metadata }) {
	const doc = await UserDocument.create({ user_id: userId, type, file_path, status: 'pending', metadata: metadata ?? null });
	return doc;
}

export async function listDocumentsForUser(userId) {
	return UserDocument.findAll({ where: { user_id: userId } });
}

export async function reviewDocument(documentId, reviewerUserId, { status, review_note }) {
	const doc = await UserDocument.findByPk(documentId);
	if (!doc) return null;
	doc.status = status;
	doc.review_note = review_note ?? null;
	doc.reviewed_by = reviewerUserId;
	doc.reviewed_at = new Date();
	await doc.save();
	return doc;
}
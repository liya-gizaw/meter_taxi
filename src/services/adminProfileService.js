
import { Profile } from '../models/associations.js';

export const adminProfileService = {
	async list({ limit = 50, offset = 0 }) {
		const { rows, count } = await Profile.findAndCountAll({ limit, offset, order: [['created_at', 'DESC']] });
		const items = rows.map(p => ({ id: p.id, user_id: p.user_id, first_name: p.first_name, last_name: p.last_name, gender: p.gender, dob: p.dob, emergency_contact: p.emergency_contact, documents: p.documents, created_at: p.created_at, updated_at: p.updated_at }));
		return { items, count };
	},
	async getById(id) {
		const p = await Profile.findByPk(id);
		if (!p) return null;
		return { id: p.id, user_id: p.user_id, first_name: p.first_name, last_name: p.last_name, gender: p.gender, dob: p.dob, emergency_contact: p.emergency_contact, documents: p.documents, created_at: p.created_at, updated_at: p.updated_at };
	},
	async create(data) {
		const p = await Profile.create({ user_id: data.user_id, first_name: data.first_name, last_name: data.last_name, gender: data.gender, dob: data.dob, emergency_contact: data.emergency_contact, documents: data.documents });
		return { id: p.id, user_id: p.user_id, first_name: p.first_name, last_name: p.last_name, gender: p.gender, dob: p.dob, emergency_contact: p.emergency_contact, documents: p.documents, created_at: p.created_at, updated_at: p.updated_at };
	},
	async update(id, data) {
		const p = await Profile.findByPk(id);
		if (!p) return null;
		Object.assign(p, {
			first_name: data.first_name ?? p.first_name,
			last_name: data.last_name ?? p.last_name,
			gender: data.gender ?? p.gender,
			dob: data.dob ?? p.dob,
			emergency_contact: data.emergency_contact ?? p.emergency_contact,
			documents: data.documents ?? p.documents,
		});
		await p.save();
		return { id: p.id, user_id: p.user_id, first_name: p.first_name, last_name: p.last_name, gender: p.gender, dob: p.dob, emergency_contact: p.emergency_contact, documents: p.documents, created_at: p.created_at, updated_at: p.updated_at };
	},
	async remove(id) {
		return Profile.destroy({ where: { id } });
	},
};
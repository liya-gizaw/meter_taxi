import { sequelize } from '../../models/index.js';
import { User, Profile } from '../../models/associations.js';
import { hashPassword } from '../../utils/hash.js';
import { toUserAggregate } from './aggregate.js';

export async function createUserAggregate({ user, profile }) {
	return sequelize.transaction(async (trx) => {
		const password_hash = user.password ? await hashPassword(user.password) : null;
		const createdUser = await User.create({
			email: user.email ?? null,
			phone: user.phone ?? null,
			role: user.role ?? 'passenger',
			is_active: user.is_active ?? true,
			password_hash,
		}, { transaction: trx });
		const createdProfile = await Profile.create({
			user_id: createdUser.id,
			first_name: profile?.first_name ?? null,
			last_name: profile?.last_name ?? null,
			gender: profile?.gender ?? null,
			dob: profile?.dob ?? null,
			emergency_contact: profile?.emergency_contact ?? null,
			documents: profile?.documents ?? null,
		}, { transaction: trx });
		const eager = await User.findByPk(createdUser.id, { include: [{ model: Profile, as: 'profile' }], transaction: trx });
		return toUserAggregate(eager);
	});
}

export async function updateUserAggregate(userId, { user, profile }) {
	return sequelize.transaction(async (trx) => {
		const u = await User.findByPk(userId, { transaction: trx, lock: trx.LOCK.UPDATE });
		if (!u) throw new Error('User not found');
		if (user) {
			if (user.email !== undefined) u.email = user.email;
			if (user.phone !== undefined) u.phone = user.phone;
			if (user.role !== undefined) u.role = user.role;
			if (user.is_active !== undefined) u.is_active = user.is_active;
			if (user.password) u.password_hash = await hashPassword(user.password);
			await u.save({ transaction: trx });
		}
		if (profile) {
			const p = await Profile.findOne({ where: { user_id: userId }, transaction: trx, lock: trx.LOCK.UPDATE });
			if (!p) throw new Error('Profile not found');
			Object.assign(p, {
				first_name: profile.first_name ?? p.first_name,
				last_name: profile.last_name ?? p.last_name,
				gender: profile.gender ?? p.gender,
				dob: profile.dob ?? p.dob,
				emergency_contact: profile.emergency_contact ?? p.emergency_contact,
				documents: profile.documents ?? p.documents,
			});
			await p.save({ transaction: trx });
		}
		const eager = await User.findByPk(userId, { include: [{ model: Profile, as: 'profile' }], transaction: trx });
		return toUserAggregate(eager);
	});
}
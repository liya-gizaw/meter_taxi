import { User, Profile, UserDocument } from '../../models/associations.js';
import { toUserAggregate } from './aggregate.js';

export async function getUserAggregateById(userId) {
	const user = await User.findByPk(userId, {
		include: [
			{ model: Profile, as: 'profile' },
			{ model: UserDocument, as: 'documents' },
		],
	});
	return toUserAggregate(user);
}

export async function listUserAggregates({ limit = 50, offset = 0 } = {}) {
	const { rows, count } = await User.findAndCountAll({
		limit,
		offset,
		order: [['created_at', 'DESC']],
		include: [
			{ model: Profile, as: 'profile' },
			{ model: UserDocument, as: 'documents' },
		],
	});
	return { items: rows.map(toUserAggregate), count };
}
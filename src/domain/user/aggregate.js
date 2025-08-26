export function toUserAggregate(userInstance) {
	if (!userInstance) return null;
	const user = userInstance;
	const profile = user.profile || null;
	const documents = Array.isArray(user.documents) ? user.documents : [];
	return {
		id: user.id,
		email: user.email,
		phone: user.phone,
		role: user.role,
		is_active: user.is_active,
		availability: user.availability,
		created_at: user.created_at,
		updated_at: user.updated_at,
		profile: profile && {
			id: profile.id,
			user_id: profile.user_id,
			first_name: profile.first_name,
			last_name: profile.last_name,
			gender: profile.gender,
			dob: profile.dob,
			emergency_contact: profile.emergency_contact,
			documents: profile.documents,
			created_at: profile.created_at,
			updated_at: profile.updated_at,
		},
		documents: documents.map((d) => ({
			id: d.id,
			user_id: d.user_id,
			type: d.type,
			file_path: d.file_path,
			status: d.status,
			metadata: d.metadata,
			review_note: d.review_note,
			reviewed_by: d.reviewed_by,
			reviewed_at: d.reviewed_at,
			created_at: d.created_at,
			updated_at: d.updated_at,
		})),
	};
}
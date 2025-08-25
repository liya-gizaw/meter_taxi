import { User } from './user.js';
import { Profile } from './profile.js';
import { Permission } from './permission.js';
import { RolePermission } from './rolePermission.js';
import { UserDocument } from './userDocument.js';
import { Rating } from './rating.js';

User.hasOne(Profile, { foreignKey: 'user_id', as: 'profile' });
Profile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Permission.hasMany(RolePermission, { foreignKey: 'permission_id', as: 'roleLinks' });
RolePermission.belongsTo(Permission, { foreignKey: 'permission_id', as: 'permission' });

// Documents
User.hasMany(UserDocument, { foreignKey: 'user_id', as: 'documents' });
UserDocument.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Ratings
User.hasMany(Rating, { foreignKey: 'rater_user_id', as: 'givenRatings' });
User.hasMany(Rating, { foreignKey: 'ratee_user_id', as: 'receivedRatings' });
Rating.belongsTo(User, { foreignKey: 'rater_user_id', as: 'rater' });
Rating.belongsTo(User, { foreignKey: 'ratee_user_id', as: 'ratee' });

export { User, Profile, Permission, RolePermission, UserDocument, Rating };


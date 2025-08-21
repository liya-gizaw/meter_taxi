import { User } from './user.js';
import { Otp } from './otp.js';
import { Profile } from './profile.js';

// Associations
User.hasMany(Otp, { foreignKey: 'user_id', as: 'otps' });
Otp.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(Profile, { foreignKey: 'user_id', as: 'profile' });
Profile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export { User, Otp, Profile };


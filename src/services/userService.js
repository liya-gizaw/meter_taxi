import dayjs from 'dayjs';
import { sequelize } from '../models/index.js';
import { User, Profile } from '../models/associations.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { signJwt } from '../utils/jwt.js';

export const userService = {
  async registerWithEmail({ email, password, role = 'passenger' }) {
    return sequelize.transaction(async (trx) => {
      const existing = await User.findOne({ where: { email }, transaction: trx });
      if (existing) {
        throw new Error('Email already registered');
      }
      const password_hash = password ? await hashPassword(password) : null;
      const user = await User.create(
        { email, password_hash, role, is_active: true },
        { transaction: trx }
      );
      await Profile.create({ user_id: user.id }, { transaction: trx });
      const token = signJwt({ id: user.id, role: user.role });
      const safeUser = {
        id: user.id,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
      return { user: safeUser, token };
    });
  },

  async loginWithEmail({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user || !user.password_hash) {
      throw new Error('Invalid credentials');
    }
    const ok = await comparePassword(password, user.password_hash);
    if (!ok) {
      throw new Error('Invalid credentials');
    }
    const token = signJwt({ id: user.id, role: user.role });
    const safeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
    return { user: safeUser, token };
  },

  // Phone auth
  async registerWithPhone({ phone, password, role = 'passenger' }) {
    return sequelize.transaction(async (trx) => {
      const existing = await User.findOne({ where: { phone }, transaction: trx });
      if (existing) throw new Error('Phone already registered');
      const password_hash = password ? await hashPassword(password) : null;
      const user = await User.create(
        { phone, password_hash, role, is_active: true },
        { transaction: trx }
      );
      await Profile.create({ user_id: user.id }, { transaction: trx });
      const token = signJwt({ id: user.id, role: user.role });
      const safeUser = {
        id: user.id,
        phone: user.phone,
        role: user.role,
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
      return { user: safeUser, token };
    });
  },

  async loginWithPhone({ phone, password }) {
    const user = await User.findOne({ where: { phone } });
    if (!user || !user.password_hash) throw new Error('Invalid credentials');
    const ok = await comparePassword(password, user.password_hash);
    if (!ok) throw new Error('Invalid credentials');
    const token = signJwt({ id: user.id, role: user.role });
    const safeUser = {
      id: user.id,
      phone: user.phone,
      role: user.role,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
    return { user: safeUser, token };
  },

  // Social login (stub)
  async loginWithSocial({ provider, externalId, email, phone, role = 'passenger' }) {
    // In production, verify provider token and map to externalId
    let user = null;
    if (email) user = await User.findOne({ where: { email } });
    if (!user && phone) user = await User.findOne({ where: { phone } });
    if (!user) {
      user = await User.create({
        email: email || null,
        phone: phone || null,
        social_provider: provider,
        role,
        is_active: true,
      });
      await Profile.create({ user_id: user.id });
    } else if (user.social_provider === 'none') {
      user.social_provider = provider;
      await user.save();
    }
    const token = signJwt({ id: user.id, role: user.role });
    const safeUser = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
    return { user: safeUser, token };
  },

  async getProfile(userId) {
    return Profile.findOne({ where: { user_id: userId } });
  },

  async updateProfile(userId, data) {
    const profile = await Profile.findOne({ where: { user_id: userId } });
    if (!profile) {
      throw new Error('Profile not found');
    }
    Object.assign(profile, data);
    await profile.save();
    return profile;
  },

  async setAvailability(userId, availability) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    user.availability = availability;
    await user.save();
    return { id: user.id, availability: user.availability };
  },
  
  async getUserById(userId) {
    return User.findByPk(userId);
  },

  async updateUserById(userId, { email, phone, password }) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (password) user.password_hash = await hashPassword(password);
    await user.save();
    return user;
  },

  async deleteUserById(userId) {
    const user = await User.findByPk(userId);
    if (!user) return 0;
    await user.destroy();
    return 1;
  },
};

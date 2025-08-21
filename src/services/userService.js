import dayjs from 'dayjs';
import { sequelize } from '../models/index.js';
import { User, Otp, Profile } from '../models/associations.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { signJwt } from '../utils/jwt.js';

export const userService = {
  async registerWithEmail({ email, password, role = 'passenger', language = 'en' }) {
    return sequelize.transaction(async (trx) => {
      const existing = await User.findOne({ where: { email }, transaction: trx });
      if (existing) {
        throw new Error('Email already registered');
      }
      const password_hash = password ? await hashPassword(password) : null;
      const user = await User.create(
        { email, password_hash, role, language, is_active: true },
        { transaction: trx }
      );
      await Profile.create({ user_id: user.id }, { transaction: trx });
      const token = signJwt({ id: user.id, role: user.role });
      return { user, token };
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
    return { user, token };
  },

  async createOtpForUser(userId, code, ttlSeconds = 300) {
    const expires_at = dayjs().add(ttlSeconds, 'second').toDate();
    return Otp.create({ user_id: userId, code, expires_at });
  },

  async verifyOtp(userId, code) {
    const otp = await Otp.findOne({ where: { user_id: userId, code, verified: false } });
    if (!otp) {
      throw new Error('OTP not found');
    }
    if (dayjs(otp.expires_at).isBefore(dayjs())) {
      throw new Error('OTP expired');
    }
    otp.verified = true;
    await otp.save();
    return true;
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
};


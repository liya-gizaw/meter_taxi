import { User } from '../models/associations.js';
import { hashPassword } from '../utils/hash.js';

export const adminUserService = {
  async list({ limit = 50, offset = 0 }) {
    const { rows, count } = await User.findAndCountAll({
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    const items = rows.map(u => ({
      id: u.id,
      email: u.email,
      phone: u.phone,
      role: u.role,
      is_active: u.is_active,
      created_at: u.created_at,
      updated_at: u.updated_at,
    }));

    return { items, count };
  },

  async getById(id) {
    const u = await User.findByPk(id);
    if (!u) return null;

    return {
      id: u.id,
      email: u.email,
      phone: u.phone,
      role: u.role,
      is_active: u.is_active,
      created_at: u.created_at,
      updated_at: u.updated_at,
    };
  },

  async create(data) {
    const password_hash = data.password ? await hashPassword(data.password) : null;

    const u = await User.create({
      email: data.email,
      phone: data.phone,
      role: data.role || 'passenger',
      is_active: data.is_active ?? true,
      password_hash,
    });

    return {
      id: u.id,
      email: u.email,
      phone: u.phone,
      role: u.role,
      is_active: u.is_active,
      created_at: u.created_at,
      updated_at: u.updated_at,
    };
  },

  async update(id, data) {
    const u = await User.findByPk(id);
    if (!u) return null;

    if (data.password) {
      u.password_hash = await hashPassword(data.password);
    }

    u.email = data.email ?? u.email;
    u.phone = data.phone ?? u.phone;
    u.role = data.role ?? u.role;
    u.is_active = data.is_active ?? u.is_active;

    await u.save();

    return {
      id: u.id,
      email: u.email,
      phone: u.phone,
      role: u.role,
      is_active: u.is_active,
      created_at: u.created_at,
      updated_at: u.updated_at,
    };
  },

  async remove(id) {
    return User.destroy({ where: { id } });
  },
};

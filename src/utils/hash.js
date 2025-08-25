import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

export async function hashPassword(plain) {
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(plain, salt);
}

export async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}
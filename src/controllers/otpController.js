import { body, validationResult } from 'express-validator';
import { userService } from '../services/userService.js';
import { generateOtp } from '../utils/otp.js';
import { User } from '../models/associations.js';

export const otpValidations = {
  request: [body('user_id').isInt().toInt()],
  verify: [body('user_id').isInt().toInt(), body('code').isString().isLength({ min: 4, max: 10 })],
};

export const otpController = {
  async request(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { user_id } = req.body;
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const code = generateOtp(6);
    await userService.createOtpForUser(user_id, code);
    // In production, send via SMS/Email. Here we return code for testing/dev only.
    return res.status(201).json({ message: 'OTP created', code });
  },

  async verify(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { user_id, code } = req.body;
    try {
      await userService.verifyOtp(user_id, code);
      return res.json({ verified: true });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};


import { Router } from 'express';
import { otpController, otpValidations } from '../controllers/otpController.js';

const router = Router();

router.post('/request', otpValidations.request, otpController.request);
router.post('/verify', otpValidations.verify, otpController.verify);

export default router;


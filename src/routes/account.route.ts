import { Router } from 'express';
import register from '../controllers/account/register.js';
import verify from '../controllers/account/verify.js';
// Middleware
import { validateRegister } from '../middleware/registerValidator.js';
const router = Router();
router.post('/register', validateRegister, register);
router.patch('/verify/:token', verify);

export default router;

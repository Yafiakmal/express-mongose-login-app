import { Router } from 'express';
import login from '../controllers/auth/login.js';
import logout from '../controllers/auth/logout.js';
import refresh from '../controllers/auth/refresh.js';
import register from '../controllers/auth/register.js';
import verify from '../controllers/auth/verify.js';

// Middleware
import { validateRegister } from '../middleware/registerValidator.js';

const router = Router();

router.post('/login', login);
router.post('/register', validateRegister, register);
router.patch('/verify/:token', verify);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
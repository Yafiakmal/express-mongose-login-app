import { Router } from 'express';
import login from '../controllers/auth/login.js';
import logout from '../controllers/auth/logout.js';
import refresh from '../controllers/auth/refresh.js';
import register from '../controllers/auth/register.js';
import verify from '../controllers/auth/verify.js';

// Middleware

import { validateRegister } from '../middleware/registerValidator.js';
import { validateLogin } from '../middleware/loginValidation.js';
import isRefreshActive from '../middleware/isRefreshActive.js';

const router = Router();

router.post('/register', validateRegister, register);
router.get('/verify/:token', verify);
router.post('/r/login', isRefreshActive, validateLogin, login);
router.post('/r/refresh', refresh);
router.post('/r/logout', logout);

export default router;
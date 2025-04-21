import { Router } from 'express';
import login from '../controllers/auth/login.js';
import logout from '../controllers/auth/logout.js';
import refresh from '../controllers/auth/refresh.js';
import register from '../controllers/auth/register.js';
import verify from '../controllers/auth/verify.js';

const router = Router();

router.get('/login', login);
router.get('/register', register);
router.get('/verify', verify);
router.get('/refresh', refresh);
router.get('/logout', logout);

export default router;
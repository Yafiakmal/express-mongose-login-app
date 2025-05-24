import { Router } from 'express';
import login from '../controllers/auth/login.js';
import logout from '../controllers/auth/logout.js';
import refresh from '../controllers/auth/refresh.js';

// Middleware
import { validateLogin } from '../middleware/login.input.js';
import isRefreshActive from '../middleware/isRefreshActive.js';

const router = Router();

router.post('/r/login', isRefreshActive, validateLogin, login);
router.post('/r/refresh', refresh);
router.post('/r/logout', logout);

export default router;
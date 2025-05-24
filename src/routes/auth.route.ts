import { Router } from 'express';
import login from '../controllers/auth/login';
import logout from '../controllers/auth/logout';
import refresh from '../controllers/auth/refresh';

// Middleware
import { validateLogin } from '../middleware/login.input';
import isRefreshActive from '../middleware/isRefreshActive';

const router = Router();

router.post('/r/login', isRefreshActive, validateLogin, login);
router.post('/r/refresh', refresh);
router.post('/r/logout', logout);

export default router;
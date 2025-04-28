import { Router } from 'express';
import register from '../controllers/account/register.js';
import verify from '../controllers/account/verify.js';
// Middleware
import { validateRegister } from '../middleware/register.input.js';
import { headerSchema } from '../middleware/remove.header.js';
import remove from '../controllers/account/remove.js';
import { validateRemove } from '../middleware/remove.input.js';
const router = Router();
router.post('/register', validateRegister, register);
router.patch('/verify/:token', verify);
router.delete('/remove', headerSchema, validateRemove, remove)

export default router;

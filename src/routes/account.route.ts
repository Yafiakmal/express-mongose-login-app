import { Router } from 'express';
import register from '../controllers/account/register';
import verify from '../controllers/account/verify';
// Middleware
import { validateRegister } from '../middleware/register.input';
import { headerSchema } from '../middleware/remove.header';
import remove from '../controllers/account/remove';
import { validateRemove } from '../middleware/remove.input';
const router = Router();
router.post('/register', validateRegister, register);
router.patch('/verify/:token', verify);
router.delete('/remove', headerSchema, validateRemove, remove)

export default router;

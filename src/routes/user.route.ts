import { Router } from 'express';
import addUser from '../controllers/user/addUser.js';
import deleteUser from '../controllers/user/deleteUser.js';
import getUser from '../controllers/user/getUser.js';
import updateUser from '../controllers/user/updateUser.js';

const router = Router();

router.get('/', getUser);
router.get('/add', addUser);
router.get('/delete/:id', deleteUser);
router.get('/update/:username', updateUser);

export default router;

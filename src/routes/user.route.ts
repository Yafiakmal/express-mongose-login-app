import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'User list endpoint works!' });
});

export default router;

import express from 'express';
import { connectDB } from '../src/db_config.js';
import userRouter from '../src/routes/user.route.js';

connectDB();

const app = express();
app.use(express.json());

app.use('/api/users', userRouter);

// 404 Middleware
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;

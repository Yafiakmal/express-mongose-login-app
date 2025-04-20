import app from '../src/app.js';
import { createServer } from 'http';

module.exports = (req: any, res: any) => {
  const server = createServer(app);
  server.emit('request', req, res);
};

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { startBot } from './src/bot/index.js';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Bot API ni ishga tushirish
  startBot();

  // API marshrutlari
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', bot: 'running' });
  });

  // Vite middleware for development or Static files for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

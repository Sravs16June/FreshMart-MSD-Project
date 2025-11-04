import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import productsRouter from './routes/products.js';

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',           // Vite local
    'http://localhost:8080',           // Vite alt port
    'https://your-app.vercel.app'      // replace with your Vercel domain
  ],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// App health
app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'api' });
});

// API routes
app.use('/api/products', productsRouter);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/freshmart';

async function start() {
  await connectDB(MONGO_URI);
  app.listen(PORT, () => console.log(`API server listening on http://localhost:${PORT}`));
}

start();

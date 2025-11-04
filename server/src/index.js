import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import productsRouter from './routes/products.js';
import authRouter from './routes/auth.js';
import aiRouter from './routes/ai.js';
import adminRouter from './routes/admin.js';

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    const allowList = [
      'http://localhost:5173',
      'http://localhost:8080',
    ];
    const isVercel = typeof origin === 'string' && origin.endsWith('.vercel.app');
    if (!origin || allowList.includes(origin) || isVercel) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// App health
app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'api' });
});

// API routes
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/ai', aiRouter);
app.use('/api/admin', adminRouter);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/freshmart';

async function start() {
  await connectDB(MONGO_URI);
  app.listen(PORT, () => console.log(`API server listening on http://localhost:${PORT}`));
}

start();

import express from 'express';
import { Product } from '../models/Product.js';

const router = express.Router();
const requireAdmin = (req, res, next) => {
  const token = req.header('x-admin-token');
  if (!token || token !== (process.env.ADMIN_TOKEN || '')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

router.post('/seed', requireAdmin, async (_req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) {
      return res.json({ ok: true, message: 'Products already exist', count });
    }

    const docs = [
      {
        name: 'Fresh Tomatoes',
        description: 'Juicy ripe tomatoes perfect for salads and sauces',
        price: 2.49,
        unit: 'kg',
        category: 'Vegetables',
        inStock: true,
        imageUrl: 'https://images.unsplash.com/photo-1561131989-b4147f7d1e5b?q=80&w=1200&auto=format&fit=crop',
      },
      {
        name: 'Organic Bananas',
        description: 'Sweet organic bananas',
        price: 1.99,
        unit: 'kg',
        category: 'Fruits',
        inStock: true,
        imageUrl: 'https://images.unsplash.com/photo-1571772805064-2075a2e3c9c4?q=80&w=1200&auto=format&fit=crop',
      },
      {
        name: 'Broccoli',
        description: 'Fresh green broccoli crowns',
        price: 2.2,
        unit: 'kg',
        category: 'Vegetables',
        inStock: true,
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop',
      },
      {
        name: 'Brown Rice',
        description: 'Whole grain brown rice 1kg pack',
        price: 3.5,
        unit: 'pack',
        category: 'Grains',
        inStock: true,
        imageUrl: 'https://images.unsplash.com/photo-1604908554023-c8a01935b9bb?q=80&w=1200&auto=format&fit=crop',
      },
    ];

    const inserted = await Product.insertMany(docs);
    return res.json({ ok: true, inserted: inserted.length });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Seed failed' });
  }
});

export default router;

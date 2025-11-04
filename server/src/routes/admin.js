import express from 'express';
import { Product } from '../models/Product.js';

const router = express.Router();
const requireAdmin = (req, res, next) => {
  const token = req.header('x-admin-token') || req.query.token;
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

router.get('/seed', requireAdmin, async (_req, res) => {
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

// Seed full catalog based on client/src/data/products.ts
router.post('/seed-client', requireAdmin, async (_req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) {
      return res.json({ ok: true, message: 'Products already exist', count });
    }

    const placeholder = '/placeholder.svg';
    const docs = [
      { name: 'Organic Tomatoes', category: 'Vegetables', price: 60, unit: '500g', description: 'Fresh, vine-ripened organic tomatoes. Perfect for salads, sauces, and cooking.', inStock: true, imageUrl: placeholder },
      { name: 'Fresh Broccoli', category: 'Vegetables', price: 80, unit: 'head', description: 'Crisp, green organic broccoli florets. Rich in vitamins and nutrients.', inStock: true, imageUrl: placeholder },
      { name: 'Ripe Bananas', category: 'Fruits', price: 50, unit: 'bunch', description: 'Sweet, perfectly ripe organic bananas. Great for snacking or smoothies.', inStock: true, imageUrl: placeholder },
      { name: 'Fresh Carrots', category: 'Vegetables', price: 45, unit: '500g', description: 'Crunchy, sweet organic carrots with greens. Perfect for snacking or cooking.', inStock: true, imageUrl: placeholder },
      { name: 'Artisan Bread', category: 'Bakery', price: 55, unit: 'loaf', description: 'Freshly baked whole wheat artisan bread. Soft with a delicious crust.', inStock: true, imageUrl: placeholder },
      { name: 'Farm Fresh Milk', category: 'Dairy', price: 65, unit: '1L', description: 'Fresh organic whole milk from local farms. Rich in calcium.', inStock: true, imageUrl: placeholder },
      { name: 'Free-Range Eggs', category: 'Dairy', price: 90, unit: 'dozen', description: 'Farm fresh free-range eggs. Mix of brown and white eggs.', inStock: true, imageUrl: placeholder },
      { name: 'Fresh Spinach', category: 'Vegetables', price: 40, unit: '250g', description: 'Nutrient-rich organic spinach leaves. Perfect for salads and smoothies.', inStock: true, imageUrl: placeholder },
      { name: 'Green Apples', category: 'Fruits', price: 120, unit: '1kg', description: 'Crisp and tangy green apples. Great for snacking and baking.', inStock: true, imageUrl: placeholder },
      { name: 'Strawberries', category: 'Fruits', price: 180, unit: '250g', description: 'Sweet organic strawberries. Freshly picked and delicious.', inStock: true, imageUrl: placeholder },
      { name: 'Oranges', category: 'Fruits', price: 100, unit: '1kg', description: 'Juicy fresh oranges. Rich in vitamin C.', inStock: true, imageUrl: placeholder },
      { name: 'Mangoes', category: 'Fruits', price: 150, unit: '1kg', description: 'Sweet Alphonso mangoes. King of fruits.', inStock: true, imageUrl: placeholder },
      { name: 'Bell Peppers', category: 'Vegetables', price: 80, unit: '3 pcs', description: 'Colorful bell peppers. Red, yellow, and green mix.', inStock: true, imageUrl: placeholder },
      { name: 'Potatoes', category: 'Vegetables', price: 30, unit: '1kg', description: 'Fresh organic potatoes. Versatile and nutritious.', inStock: true, imageUrl: placeholder },
      { name: 'Onions', category: 'Vegetables', price: 40, unit: '1kg', description: 'Red onions. Essential kitchen staple.', inStock: true, imageUrl: placeholder },
      { name: 'Cheese', category: 'Dairy', price: 220, unit: '200g', description: 'Organic cheddar cheese. Rich and creamy.', inStock: true, imageUrl: placeholder },
      { name: 'Greek Yogurt', category: 'Dairy', price: 80, unit: '400g', description: 'Creamy Greek yogurt. High in protein.', inStock: true, imageUrl: placeholder },
      { name: 'Croissants', category: 'Bakery', price: 120, unit: '4 pcs', description: 'Buttery croissants. Fresh from the oven.', inStock: true, imageUrl: placeholder },
      { name: 'Blueberries', category: 'Fruits', price: 200, unit: '200g', description: 'Fresh organic blueberries. Antioxidant rich.', inStock: true, imageUrl: placeholder },
      { name: 'Avocados', category: 'Fruits', price: 150, unit: '3 pcs', description: 'Ripe avocados. Creamy and nutritious.', inStock: true, imageUrl: placeholder },
      { name: 'Cucumbers', category: 'Vegetables', price: 35, unit: '500g', description: 'Fresh cucumbers. Crisp and refreshing.', inStock: true, imageUrl: placeholder },
      { name: 'Lettuce', category: 'Vegetables', price: 45, unit: '1 head', description: 'Crisp lettuce. Perfect for salads.', inStock: true, imageUrl: placeholder },
      { name: 'Mushrooms', category: 'Vegetables', price: 90, unit: '250g', description: 'Fresh button mushrooms. Earthy and delicious.', inStock: true, imageUrl: placeholder },
      { name: 'Garlic', category: 'Vegetables', price: 60, unit: '200g', description: 'Organic garlic bulbs. Essential for cooking.', inStock: true, imageUrl: placeholder },
      { name: 'Ginger', category: 'Vegetables', price: 50, unit: '250g', description: 'Fresh organic ginger. Great for cooking and tea.', inStock: true, imageUrl: placeholder },
      { name: 'Sweet Corn', category: 'Vegetables', price: 40, unit: '2 pcs', description: 'Fresh sweet corn. Perfect for grilling.', inStock: true, imageUrl: placeholder },
      { name: 'Cauliflower', category: 'Vegetables', price: 50, unit: '1 head', description: 'Fresh cauliflower. Versatile vegetable.', inStock: true, imageUrl: placeholder },
      { name: 'Green Beans', category: 'Vegetables', price: 60, unit: '500g', description: 'Tender green beans. Fresh and crunchy.', inStock: true, imageUrl: placeholder },
      { name: 'Watermelon', category: 'Fruits', price: 40, unit: '1kg', description: 'Sweet watermelon. Refreshing summer fruit.', inStock: true, imageUrl: placeholder },
      { name: 'Grapes', category: 'Fruits', price: 120, unit: '500g', description: 'Sweet grapes. Red or green variety.', inStock: true, imageUrl: placeholder },
      { name: 'Pomegranate', category: 'Fruits', price: 100, unit: '2 pcs', description: 'Fresh pomegranates. Rich in antioxidants.', inStock: true, imageUrl: placeholder },
      { name: 'Papaya', category: 'Fruits', price: 60, unit: '1 pc', description: 'Ripe papaya. Sweet and healthy.', inStock: true, imageUrl: placeholder },
      { name: 'Butter', category: 'Dairy', price: 120, unit: '200g', description: 'Organic butter. Rich and creamy.', inStock: true, imageUrl: placeholder },
      { name: 'Paneer', category: 'Dairy', price: 150, unit: '250g', description: 'Fresh paneer. High in protein.', inStock: true, imageUrl: placeholder },
      { name: 'Cream', category: 'Dairy', price: 80, unit: '200ml', description: 'Fresh cream. Perfect for desserts.', inStock: true, imageUrl: placeholder },
      { name: 'Muffins', category: 'Bakery', price: 100, unit: '4 pcs', description: 'Chocolate muffins. Freshly baked.', inStock: true, imageUrl: placeholder },
    ];

    const inserted = await Product.insertMany(docs);
    return res.json({ ok: true, inserted: inserted.length });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Seed failed' });
  }
});

export default router;

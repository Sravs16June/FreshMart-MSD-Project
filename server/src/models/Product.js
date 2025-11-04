import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String },
    category: { type: String },
    inStock: { type: Boolean, default: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);

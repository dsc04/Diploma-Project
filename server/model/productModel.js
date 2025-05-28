import mongoose from 'mongoose';
import userModel from './userModel.js';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  creationDate: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: ['Electronics', 'Clothing', 'Books', 'Furniture', 'Other'], default: 'Other' },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
});

export default mongoose.model('Product', productSchema);
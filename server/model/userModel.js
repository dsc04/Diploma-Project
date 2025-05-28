import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  description: { type: String },
  Avatar: { type: String },
  sellerAverageRating: { type: Number, default: 0, min: 0, max: 5 },
  sellerReviewCount: { type: Number, default: 0 },
});

export default mongoose.model('User', userSchema);
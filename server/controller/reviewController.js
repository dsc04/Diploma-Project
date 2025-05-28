import Review from '../model/reviewModel.js';
import Product from '../model/productModel.js';
import User from '../model/userModel.js';
import ApiError from '../exceptions/apiErrors.js';
import { validationResult } from 'express-validator';

export class ReviewController {
  async addReview(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка валидации', errors.array()));
      }

      const { productId, productRating, sellerRating, comment } = req.body;
      const userId = req.user.id;

      // Проверяем существование товара
      const product = await Product.findById(productId).lean();
      if (!product) {
        return next(ApiError.NotFound('Товар не найден'));
      }

      // Проверяем, что пользователь не оставляет отзыв на свой товар
      if (product.user.toString() === userId) {
        return next(ApiError.BadRequest('Нельзя оставить отзыв на свой товар'));
      }

      // Проверяем, не оставлял ли пользователь отзыв ранее
      const existingReview = await Review.findOne({ product: productId, user: userId });
      if (existingReview) {
        return next(ApiError.BadRequest('Вы уже оставили отзыв на этот товар'));
      }

      // Создаём отзыв
      const review = await Review.create({
        product: productId,
        seller: product.user,
        user: userId,
        productRating,
        sellerRating,
        comment,
      });

      // Обновляем рейтинг товара
      const productReviews = await Review.find({ product: productId });
      const productAvgRating =
        productReviews.length > 0
          ? productReviews.reduce((sum, r) => sum + r.productRating, 0) / productReviews.length
          : 0;
      await Product.findByIdAndUpdate(productId, {
        averageRating: productAvgRating,
        reviewCount: productReviews.length,
      });

      // Обновляем рейтинг продавца
      const sellerReviews = await Review.find({ seller: product.user });
      const sellerAvgRating =
        sellerReviews.length > 0
          ? sellerReviews.reduce((sum, r) => sum + r.sellerRating, 0) / sellerReviews.length
          : 0;
      const sellerReviewCount = sellerReviews.length;
      const updatedSeller = await User.findByIdAndUpdate(
        product.user,
        {
          sellerAverageRating: sellerAvgRating,
          sellerReviewCount: sellerReviewCount,
        },
        { new: true, runValidators: true }
      );
      if (!updatedSeller) {
        return next(ApiError.NotFound('Продавец не найден'));
      }
      console.log('Updated seller data:', {
        _id: updatedSeller._id,
        sellerAverageRating: updatedSeller.sellerAverageRating,
        sellerReviewCount: updatedSeller.sellerReviewCount,
      }); // Debug log

      res.json({ message: 'Отзыв добавлен', review });
    } catch (e) {
      console.error('Error in addReview:', e);
      next(e);
    }
  }

  async getProductReviews(req, res, next) {
    try {
      const reviews = await Review.find({ product: req.params.id })
        .populate('user', 'name Avatar')
        .sort({ createdAt: -1 });
      console.log(`Fetched product reviews for productId: ${req.params.id}`, reviews);
      res.json(reviews);
    } catch (e) {
      console.error('Error in getProductReviews:', e);
      next(e);
    }
  }

  async getSellerReviews(req, res, next) {
    try {
      const reviews = await Review.find({ seller: req.params.userId })
        .populate('user', 'name Avatar')
        .populate('product', 'name')
        .sort({ createdAt: -1 });
      console.log(`Fetched seller reviews for userId: ${req.params.userId}`, reviews);
      res.json(reviews);
    } catch (e) {
      console.error('Error in getSellerReviews:', e);
      next(e);
    }
  }
}
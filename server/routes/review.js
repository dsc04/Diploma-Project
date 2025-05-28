import express from 'express';
import { ReviewController } from '../controller/reviewController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { body } from 'express-validator';

const reviewController = new ReviewController();
const route = express.Router();

route.post(
  '/review',
  authMiddleware,
  [
    body('productId').isMongoId().withMessage('Неверный ID товара'),
    body('productRating').isInt({ min: 1, max: 5 }).withMessage('Рейтинг товара должен быть от 1 до 5'),
    body('sellerRating').isInt({ min: 1, max: 5 }).withMessage('Рейтинг продавца должен быть от 1 до 5'),
    body('comment').isString().trim().notEmpty().withMessage('Комментарий обязателен'),
  ],
  reviewController.addReview
);

route.get('/product/:id/reviews', reviewController.getProductReviews);
route.get('/user/:userId/reviews', reviewController.getSellerReviews);

export default route;
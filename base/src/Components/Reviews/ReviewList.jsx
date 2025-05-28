import React, { useEffect, useState } from 'react';
import $api from '../../http';
import RatingDisplay from './RatingDisplay';
import './ReviewList.css';

const ReviewList = ({ productId, sellerId }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const endpoint = productId
          ? `/api/product/${productId}/reviews`
          : `/api/user/${sellerId}/reviews`;
        console.log(`Fetching reviews from: ${endpoint}`);
        const response = await $api.get(endpoint);
        console.log('Reviews response:', JSON.stringify(response.data, null, 2)); // Detailed log
        setReviews(Array.isArray(response.data) ? response.data : []);
      } catch (e) {
        console.error('Error fetching reviews:', e.response?.data || e.message);
        setError(e.response?.data?.message || 'Ошибка при загрузке отзывов');
      } finally {
        setIsLoading(false);
      }
    };

    if (productId || sellerId) {
      fetchReviews();
    } else {
      setIsLoading(false);
      setError('Не указан ID товара или продавца');
    }
  }, [productId, sellerId]);

  if (isLoading) return <p>Загрузка отзывов...</p>;
  if (error) return <p className="error">{error}</p>;
  if (reviews.length === 0) return <p>Отзывов пока нет</p>;

  return (
    <div className="review-list">
      {reviews.map((review) => (
        <div key={review._id} className="review-item">
          <div className="review-header">
            <img
              src={review.user?.Avatar || '/images/default.jpg'}
              alt={review.user?.name || 'Аноним'}
              className="reviewer-avatar"
              onError={(e) => (e.target.src = '/images/default.jpg')}
            />
            <div>
              <p className="reviewer-name">{review.user?.name || 'Аноним'}</p>
              <p className="review-date">
                {review.createdAt
                  ? new Date(review.createdAt).toLocaleDateString()
                  : 'Дата неизвестна'}
              </p>
            </div>
          </div>
          <div className="review-ratings">
            <div>
              <span>Товар: </span>
              <RatingDisplay
                rating={review.productRating || 0}
                reviewCount={1}
              />
            </div>
            <div>
              <span>Продавец: </span>
              <RatingDisplay
                rating={review.sellerRating || 0}
                reviewCount={1}
              />
            </div>
          </div>
          <p className="review-comment">{review.comment || 'Нет комментария'}</p>
          {review.product && sellerId && (
            <p className="review-product">Товар: {review.product.name || 'Неизвестный товар'}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
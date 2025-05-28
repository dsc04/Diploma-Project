import React, { useState, useContext } from 'react';
import $api from '../../http';
import { AuthContext } from '../../Context/AuthContext';
import './ReviewForm.css';

const ReviewForm = ({ productId, sellerId, onReviewAdded }) => {
  const { user } = useContext(AuthContext);
  const [productRating, setProductRating] = useState(0);
  const [sellerRating, setSellerRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Войдите, чтобы оставить отзыв');
      return;
    }
    if (!productRating || !sellerRating || !comment) {
      setError('Заполните все поля');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await $api.post('/api/review', {
        productId,
        productRating,
        sellerRating,
        comment,
      });
      setSuccess('Отзыв добавлен');
      setProductRating(0);
      setSellerRating(0);
      setComment('');
      onReviewAdded(response.data.review); // Pass the new review to the callback
    } catch (e) {
      setError(e.response?.data?.message || 'Ошибка при добавлении отзыва');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating, setRating) => (
    <div className="star-rating">
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <span
            key={index}
            className={index < rating ? 'star filled' : 'star'}
            onClick={() => setRating(index + 1)}
          >
            ★
          </span>
        ))}
    </div>
  );

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Оставить отзыв</h3>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <div className="form-group">
        <label>Рейтинг товара:</label>
        {renderStars(productRating, setProductRating)}
      </div>
      <div className="form-group">
        <label>Рейтинг продавца:</label>
        {renderStars(sellerRating, setSellerRating)}
      </div>
      <div className="form-group">
        <label>Комментарий:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Отправка...' : 'Отправить'}
      </button>
    </form>
  );
};

export default ReviewForm;
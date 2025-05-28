import React from 'react';
import './RatingDisplay.css';

const RatingDisplay = ({ rating, reviewCount }) => {
  const stars = Array(5)
    .fill(0)
    .map((_, index) => (
      <span key={index} className={index < Math.round(rating) ? 'star filled' : 'star'}>
        ★
      </span>
    ));

  return (
    <div className="rating-display">
      {stars}
      <span className="review-count">({reviewCount} отзывов)</span>
    </div>
  );
};

export default RatingDisplay;
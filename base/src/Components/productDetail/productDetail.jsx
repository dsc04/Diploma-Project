import React, { useEffect, useState, useContext, useCallback } from 'react'; // Added useCallback
import { useParams, useNavigate } from 'react-router-dom';
import $api from '../../http';
import Header from '../Header/Header';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './productDetail.css';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import RatingDisplay from '../Reviews/RatingDisplay';
import ReviewForm from '../Reviews/ReviewForm';
import ReviewList from '../Reviews/ReviewList';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

const fetchProduct = useCallback(async () => {
    try {
      const response = await $api.get(`/api/product/${id}`);
      setProduct(response.data);
      console.log('Product data:', response.data);
    } catch (error) {
      console.error('Ошибка при получении товара:', error);
      setError('Не удалось загрузить товар');
    } finally {
      setIsLoading(false);
    }
  }, [id]); // id is a dependency since it's used in the API call

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]); // Add fetchProduct as a dependency

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  if (isLoading) {
    return (
      <div style={{ padding: '2rem' }}>
        <Header />
        <div>Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <Header />
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '2rem' }}>
        <Header />
        <div>Товар не найден</div>
      </div>
    );
  }

  const uniqueImages = [...new Set(product.images || [])];
  const isOwnProduct = user && product.user && user.id === product.user._id?.toString();
  console.log('Is own product:', isOwnProduct, 'User ID:', user?.id, 'Product User ID:', product.user?._id?.toString());

  return (
    <div style={{ padding: '2rem' }}>
      <Header />
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <button
          onClick={() => navigate(-1)}
          className="back-button"
          style={{ padding: '0.5rem 1rem', backgroundColor: '#ddd', border: 'none', borderRadius: '4px' }}
        >
          Назад
        </button>
      </div>
      <div className="product-detail">
        <div className="detail-layout">
          <div className="detail-images">
            {uniqueImages.length > 0 ? (
              <Slider {...sliderSettings}>
                {uniqueImages.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="product-detail-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                        console.error(`Failed to load image: ${image}`);
                      }}
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <p>Изображения отсутствуют</p>
            )}
          </div>
          <div className="detail-content">
            <h1 className="product-detail-name">{product.name}</h1>
            <RatingDisplay rating={product.averageRating} reviewCount={product.reviewCount} />
            <p className="product-detail-description">{product.description}</p>
            <div className="product-meta">
              <span className="product-detail-price">{product.price} ₸</span>
              <span className="meta-dot">·</span>
              <span className="product-detail-category">{product.category}</span>
            </div>
            <div className="product-detail-info">
              <div className="product-meta">
                <div className="product-detail-seller">
                  {product.user && product.user.Avatar ? (
                    <Link to={isOwnProduct ? '/Profile' : `/profile/${product.user._id}`}>
                      <img
                        src={product.user.Avatar}
                        alt={product.user.name || 'Пользователь'}
                        className="seller-avatar"
                        style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '1rem', cursor: 'pointer' }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                          console.error(`Failed to load avatar: ${product.user.Avatar}`);
                        }}
                      />
                    </Link>
                  ) : (
                    <span style={{ width: '40px', height: '40px', display: 'inline-block', marginRight: '1rem' }} />
                  )}
                  {product.user ? (
                    <Link
                      to={isOwnProduct ? '/Profile' : `/profile/${product.user._id}`}
                      style={{ textDecoration: 'none', color: '#333' }}
                    >
                      {product.user.name || 'Неизвестный'}
                    </Link>
                  ) : (
                    <span>Пользователь не найден</span>
                  )}
                </div>
                <span className="meta-dot">·</span>
                <span className="product-detail-date">
                  Опубликовано: {new Date(product.creationDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            {!isOwnProduct && user && (
              <button
                className="add-review-button"
                onClick={() => setShowReviewForm(!showReviewForm)}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {showReviewForm ? 'Скрыть форму' : 'Добавить отзыв'}
              </button>
            )}
            {showReviewForm && !isOwnProduct && user && (
              <ReviewForm
                productId={product._id}
                sellerId={product.user._id}
                onReviewAdded={() => {
                  setShowReviewForm(false);
                  fetchProduct(); // Перезагрузка данных товара
                }}
              />
            )}
          </div>
        </div>
        <ReviewList productId={product._id} />
      </div>
    </div>
  );
};

export default ProductDetail;
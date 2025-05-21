import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import $api from '../../http'; // Adjust path based on your http.js location
import Header from '../Header/Header';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await $api.get("/api/products");
        console.log("Products:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Ошибка при получении товаров:", error);
        setError("Не удалось загрузить товары");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: "2rem" }}>
        <Header />
        <div>Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem" }}>
        <Header />
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <Header />
      <h1 className="home-title">Маркетплейс Hardpoint</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img
              src={`http://localhost:8000${product.image}`}
              alt={product.name}
              className="product-image"
            />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-description">{product.description}</p>
            <p className="product-price">{product.price} ₸</p>
            <p className="product-category">Категория: {product.category}</p>
            <p className="product-date">
              Опубликовано: {new Date(product.creationDate).toLocaleDateString()}
            </p>
            <p className="product-seller">
              Продавец: {product.user?.name || "Неизвестный"}
            </p>
            <Link to={`/product/${product._id}`} className="product-link">
              Подробнее
            </Link>
          </div>
        ))}
      </div>
      {products.length === 0 && <p>Нет товаров для отображения.</p>}
    </div>
  );
};

export default Home;
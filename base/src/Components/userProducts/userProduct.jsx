import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import $api from "../../http";
import { AuthContext } from "../../Context/AuthContext";
import "./userProducts.css";

const UserProducts = ({ userId: profileUserId, isOwnProfile }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isLoading: isAuthLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        // Ждём завершения загрузки авторизации
        if (isAuthLoading) {
          console.log("Waiting for auth to complete");
          return;
        }

        // Используем profileUserId как fallback для isOwnProfile
        const targetUserId = isOwnProfile ? (user?.id || profileUserId) : profileUserId;
        console.log("Fetching products for userId:", targetUserId);
        if (!targetUserId) {
          setError("Идентификатор пользователя отсутствует");
          return;
        }

        const response = await $api.get(`/api/user-products/${targetUserId}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Ошибка при получении товаров:", error);
        setError(error.response?.data?.message || "Не удалось загрузить товары");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProducts();
  }, [user, profileUserId, isOwnProfile, isAuthLoading]);

  if (isLoading || isAuthLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="user-products">
      <h2 className="user-products-title">{isOwnProfile ? "Ваши товары" : "Товары пользователя"}</h2>
      {products.length === 0 ? (
        <p>Вы еще не опубликовали ни одного товара.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="product-card"
            >
              <img
                src={product.images[0] || "https://placehold.co/150x150?text=Image+Not+Found"}
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  e.target.src = "https://placehold.co/150x150?text=Image+Not+Found";
                  console.error(`Failed to load image: ${product.images[0]}`);
                }}
              />
              <h2 className="product-name">{product.name}</h2>
              <p className="product-description">
                {product.description.length > 100
                  ? `${product.description.slice(0, 100)}...`
                  : product.description}
              </p>
              <div className="product-meta">
                <span className="product-price">{product.price} ₸</span>
                <span className="meta-dot">·</span>
                <span className="product-category">{product.category}</span>
              </div>
              <p className="product-date">
                Опубликовано: {new Date(product.creationDate).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProducts;
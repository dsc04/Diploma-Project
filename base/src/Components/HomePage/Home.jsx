import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import $api from "../../http";
import Header from "../Header/Header";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./Home.css";

const Home = () => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const maxPriceResponse = await $api.get("/api/max-price");
        const newMaxPrice = maxPriceResponse.data.maxPrice || 100000;
        setMaxPrice(newMaxPrice);
        setPriceRange([0, newMaxPrice]);

        const productsResponse = await $api.get("/api/products");
        setGroupedProducts(productsResponse.data);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
        setError("Не удалось загрузить данные");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setShowFilters(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("query", searchQuery);
      if (selectedCategory) params.append("category", selectedCategory);
      if (sortOrder) params.append("sortOrder", sortOrder);
      params.append("minPrice", priceRange[0]);
      params.append("maxPrice", priceRange[1]);

      const response = await $api.get(`/api/search?${params.toString()}`);
      setGroupedProducts(response.data);
    } catch (error) {
      console.error("Ошибка при поиске:", error);
      setError("Не удалось выполнить поиск");
    }
  };

  const handleClearFilters = async () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSortOrder("");
    setPriceRange([0, maxPrice]);
    setShowFilters(false);
    try {
      const response = await $api.get("/api/products");
      setGroupedProducts(response.data);
    } catch (error) {
      console.error("Ошибка при очистке фильтров:", error);
      setError("Не удалось загрузить товары");
    }
  };

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
      <div className="filters-container">
        <div className="filters-left">
          {showFilters && (
            <>
              <div className="filter-group">
                <label htmlFor="category">Категория:</label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Все категории</option>
                  <option value="Electronics">Электроника</option>
                  <option value="Clothing">Одежда</option>
                  <option value="Books">Книги</option>
                  <option value="Furniture">Мебель</option>
                  <option value="Other">Другое</option>
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="sort">Сортировка по цене:</label>
                <select
                  id="sort"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Без сортировки</option>
                  <option value="asc">По возрастанию</option>
                  <option value="desc">По убыванию</option>
                </select>
              </div>
              <div className="filter-group price-range">
                <label>Диапазон цен:</label>
                <div className="price-inputs">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="price-input"
                    placeholder="Мин. цена"
                  />
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="price-input"
                    placeholder="Макс. цена"
                  />
                </div>
                <Slider
                  range
                  min={0}
                  max={maxPrice}
                  value={priceRange}
                  onChange={(value) => setPriceRange(value)}
                  className="price-slider"
                />
              </div>
            </>
          )}
        </div>
        <div className="search-right">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск товаров..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              Поиск
            </button>
            {(searchQuery || showFilters) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="clear-button"
              >
                Очистить
              </button>
            )}
          </form>
        </div>
      </div>
      <h1 className="home-title">Товары по категориям</h1>
      {Object.keys(groupedProducts).length === 0 ? (
        <p>Нет товаров для отображения.</p>
      ) : (
        Object.entries(groupedProducts).map(([category, products]) => (
          <div key={category} className="category-section">
            <h2 className="category-title">
              {category === "Electronics"
                ? "Электроника"
                : category === "Clothing"
                ? "Одежда"
                : category === "Books"
                ? "Книги"
                : category === "Furniture"
                ? "Мебель"
                : "Другое"}
            </h2>
            <div className="product-grid">
              {products.map((product) => (
                <Link
                  to={`/product/${product._id}`}
                  key={product._id}
                  className="product-card"
                >
                  <img
                    src={product.images[0]}
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
                  <p className="product-seller">
                    Продавец: {product.user?.name || "Неизвестный"}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
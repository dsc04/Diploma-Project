import React, { useState } from "react";
import $api from "../../http";
// import "./addProduct.css"
import { Link } from "react-router-dom";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Other");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("image", image);

    try {
      const response = await $api.post("/product", formData);
      console.log("Product added:", response.data);
      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setCategory("Other");
      setImage(null);
      alert("Товар успешно добавлен!");
    } catch (error) {
      console.error("Ошибка при добавлении товара:", error);
      setError(error.response?.data?.message || "Не удалось добавить товар");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
<div className="add-product">
      <h1>Добавить товар</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Название</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label>Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label>Цена (₸)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label>Категория</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {/* options */}
          </select>
        </div>
        
        <div>
          <label>Изображение</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Добавление..." : "Добавить товар"}
        </button>
        
        {error && <p className="error-message">{error}</p>}
      </form>
                  <Link to='/' className='back-btn'>
                    <i className="fas fa-arrow-left"></i> Назад
                  </Link>
    </div>
  );
};

export default AddProduct;
import React, { useState } from "react";
import $api from "../../http";
import "./addProduct.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Other");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, 10);
    setImages(selectedFiles);
  };

  const onDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = e.dataTransfer.getData("index");
    const newImages = [...images];
    const [draggedItem] = newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, draggedItem);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    const imageOrder = images.map((img) => img); // Копируем порядок
    imageOrder.forEach((image) => {
      formData.append("images", image);
    });
    console.log("Sending images order:", imageOrder.map((img, idx) => ({ index: idx, name: img.name })));

    try {
      const response = await $api.post("/api/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Product added:", response.data);
      setName("");
      setDescription("");
      setPrice("");
      setCategory("Other");
      setImages([]);
      toast.success("Товар успешно добавлен!"); // Уведомление
      navigate("/"); // Редирект на главную
    } catch (error) {
      console.error("Ошибка при добавлении товара:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        setError("Пожалуйста, войдите в систему для добавления товара");
      } else {
        setError(error.response?.data?.message || "Не удалось добавить товар");
        toast.error(error.response?.data?.message || "Не удалось добавить товар"); // Уведомление об ошибке
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-product p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Добавить товар</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Название</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Цена (₸)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Категория</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded p-2"
            required
          >
            <option value="Electronics">Электроника</option>
            <option value="Clothing">Одежда</option>
            <option value="Books">Книги</option>
            <option value="Furniture">Мебель</option>
            <option value="Other">Другое</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Изображения (до 10, перетащите для сортировки)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            required
            className="w-full mb-2"
          />
          <div className="image-preview">
            {images.map((image, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => onDragStart(e, index)}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, index)}
                style={{
                  margin: "0.5rem",
                  display: "inline-block",
                  border: "1px solid #ccc",
                  padding: "5px",
                }}
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
                <span>{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting ? "Добавление..." : "Добавить товар"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default AddProduct;
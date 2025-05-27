import React, { useState } from "react";
import $api from "../../../http";
import "./avatarUploader.css";

const AvatarUploader = ({ user, setUser }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Пожалуйста, выберите файл");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    setUploading(true);
    setError(null);

    try {
      const response = await $api.put("/api/upload-avatar", formData);
      console.log("Response:", response.data); // Debug log
      // Преобразуем _id в id для соответствия ожиданиям Profile.jsx
      setUser({
        ...response.data.user,
        id: response.data.user._id || response.data.user.id,
      });
      setSelectedFile(null);
    } catch (error) {
      console.error("Ошибка при загрузке:", error);
      setError(error.response?.data?.message || "Не удалось загрузить аватар");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="avatar-uploader">
      <input
        type="file"
        id="avatarInput"
        accept="image/*"
        onChange={handleFileChange}
      />
      <label htmlFor="avatarInput">
        {selectedFile ? selectedFile.name : "Выберите файл"}
      </label>
      <button
        onClick={handleUpload}
        disabled={uploading || !selectedFile}
      >
        {uploading ? "Загрузка..." : "Загрузить аватар"}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AvatarUploader;
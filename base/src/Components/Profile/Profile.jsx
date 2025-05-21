import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Add this import
import $api from "../../http";
import Header from "../Header/Header";
import AvatarUploader from "./avatarUploader/avatarUploader";
import Logout from "../Logout/Logout";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await $api.get("/checkAuth");
        console.log("User data:", response.data);
        setUser(response.data.user);
      } catch (error) {
        console.error("Ошибка при получении пользователя:", error);
        setError("Не удалось загрузить профиль");
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <Header />
      <div className="profile-container">
        <h1 className="profile-title animate__animated animate__fadeInDown">
          {user?.name || "Нет имени"}
        </h1>
        <div className="profile-image-container animate__animated animate__fadeIn">
          <img
            src={user?.Avatar ? `http://localhost:8000${user.Avatar}` : "/images/default.jpg"}
            className="profile-image"
            width={250}
            height={250}
            alt="ProfilePicture"
            loading="lazy"
          />
        </div>
        <div className="profile-description animate__animated animate__fadeInUp">
          <p>{user?.description || "Нет описания"}</p>
        </div>
        <div className="mt-4">
          <Link to="/add-product" className="text-blue-600 hover:underline">
            Добавить товар
          </Link>
        </div>
        <Logout />
        <AvatarUploader user={user} setUser={setUser} />
      </div>
    </div>
  );
};

export default Profile;
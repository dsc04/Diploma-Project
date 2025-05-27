import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import $api from "../../http";
import Header from "../Header/Header";
import AvatarUploader from "./avatarUploader/avatarUploader";
import Logout from "../Logout/Logout";
import UserProducts from "../userProducts/userProduct";
import "./Profile.css";

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        let response;
        if (userId) {
          response = await $api.get(`/api/users/${userId}`);
          console.log("Response from /api/users/:id:", response.data); // Лог для отладки
          setUser({ ...response.data, id: response.data._id || response.data.id });
        } else {
          response = await $api.get("/api/checkAuth");
          console.log("Response from /api/checkAuth:", response.data); // Лог для отладки
          setUser({ ...response.data.user, id: response.data.user.id || response.data.user._id });
        }
      } catch (error) {
        console.error("Ошибка при получении пользователя:", error);
        setError("Не удалось загрузить профиль");
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [userId]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!user || !user.id) {
    return <div>Пользователь не найден или отсутствует идентификатор</div>;
  }

  const isOwnProfile = !userId;

  return (
    <div>
      <Header />
      <div className="profile-container">
        <div className="profile-layout">
          <div className="profile-image-container animate__animated animate__fadeIn">
            <img
              src={user?.Avatar || "/images/default.jpg"}
              className="profile-image"
              width={250}
              height={250}
              alt="ProfilePicture"
              loading="lazy"
              onError={(e) => {
                e.target.src = "/images/default.jpg";
                console.error(`Failed to load avatar: ${user.Avatar}`);
              }}
            />
          </div>
          <div className="profile-content">
            <h1 className="profile-title animate__animated animate__fadeInDown">
              {user?.name || "Нет имени"}
            </h1>
            <div className="profile-description animate__animated animate__fadeInUp">
              <p>{user?.description || "Нет описания"}</p>
            </div>
            {isOwnProfile && (
              <>
                <div className="mt-4">
                  <Link to="/add-product" className="text-blue-600 hover:underline">
                    Добавить товар
                  </Link>
                </div>
                <Logout />
                <AvatarUploader user={user} setUser={setUser} />
              </>
            )}
          </div>
        </div>
      </div>
      <UserProducts userId={user.id} isOwnProfile={isOwnProfile} />
    </div>
  );
};

export default Profile;
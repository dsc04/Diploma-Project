import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Logout from "../Logout/Logout";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/checkAuth", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
        });
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Ошибка при получении пользователя:", error);
      }
    };

    getUser();
  }, []);

  return (
    <div>
      <Header />
      <div className="profile-container">
        <h1 className="profile-title animate__animated animate__fadeInDown">
          {user?.name || "Загрузка..."}
        </h1>
        <div className="profile-image-container animate__animated animate__fadeIn">
          <img
            src="images/ProfilePicture.jpg"
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
        <Logout />
      </div>
    </div>
  );
};

export default Profile;

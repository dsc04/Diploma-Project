import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import $api from '../../http';
import Header from '../Header/Header';
import AvatarUploader from './avatarUploader/avatarUploader';
import Logout from '../Logout/Logout';
import UserProducts from '../userProducts/userProduct';
import ReviewList from '../Reviews/ReviewList';
import RatingDisplay from '../Reviews/RatingDisplay';
import './Profile.css';

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [refreshKey, setRefreshKey] = useState(0); 
  const [isEditing, setIsEditing] = useState(false); // New state for edit mode

  const fetchUserData = useCallback(async () => {
    try {
      let response;
      if (userId) {
        response = await $api.get(`/api/users/${userId}`);
        console.log('Response from /api/users/:id:', response.data);
        setUser({ ...response.data, id: response.data._id || response.data.id });
      } else {
        response = await $api.get('/api/checkAuth');
        console.log('Response from /api/checkAuth:', response.data);
        setUser({ ...response.data.user, id: response.data.user.id || response.data.user._id });
      }
      console.log('Profile userId:', userId, 'isOwnProfile:', !userId, 'user.id:', response.data._id || response.data.user._id);
    } catch (error) {
      console.error('Ошибка при получении пользователя:', error.response?.data || error.message);
      setError('Не удалось загрузить профиль');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (activeTab === 'reviews') {
      console.log('Switching to reviews tab, refreshing with sellerId:', user?.id);
      setRefreshKey((prev) => prev + 1);
    }
  }, [activeTab, user?.id]);

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
              src={user?.Avatar || '/images/default.jpg'}
              className="profile-image"
              width={250}
              height={250}
              alt="ProfilePicture"
              loading="lazy"
              onError={(e) => {
                e.target.src = '/images/default.jpg';
                console.error(`Failed to load avatar: ${user.Avatar}`);
              }}
            />
          </div>
          <div className="profile-content">
            <div className="profile-header">
              <h1 className="profile-title animate__animated animate__fadeInDown">
                {user?.name || 'Нет имени'}
              </h1>
              {isOwnProfile && (
                <button
                  className="edit-profile-btn"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Сохранить' : 'Редактировать профиль'}
                </button>
              )}
            </div>
            <RatingDisplay rating={user.sellerAverageRating || 0} reviewCount={user.sellerReviewCount || 0} />
            <div className="profile-description animate__animated animate__fadeInUp">
              <p>{user?.description || 'Нет описания'}</p>
            </div>
            {isOwnProfile && isEditing && (
              <AvatarUploader user={user} setUser={setUser} />
            )}
          </div>
        </div>
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Товары
          </button>
          <button
            className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Отзывы
          </button>
        </div>
        <div className="tab-content">
          {activeTab === 'products' && <UserProducts userId={user.id} isOwnProfile={isOwnProfile} />}
          {activeTab === 'reviews' && <ReviewList sellerId={user.id} key={refreshKey} />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
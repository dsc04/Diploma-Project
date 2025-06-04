import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { AuthContext } from '../../Context/AuthContext'; 
import Logout from '../Logout/Logout';

const Header = () => {
  const { user, logout } = useContext(AuthContext); // Access user and logout function
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Handler to toggle the drawer
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Handler to perform logout
  const handleLogout = async () => {
    try {
      await logout(); // Assume logout is a function in AuthContext
      setIsDrawerOpen(false); // Close drawer after logout
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  return (
    <header>
      <h1><Link className='title' to="/">hardpoint</Link></h1>
      <div className='HeaderButtons'>
        {!user ? (
          <Link to="/Login" className="btn btn-success">Вход</Link>
        ) : (
          <div className="user-section" onClick={toggleDrawer}>
            <img
              src={user.Avatar || '/images/default.jpg'}
              alt={`${user.name || 'User'}'s Avatar`}
              className="user-avatar"
              onError={(e) => {
                e.target.src = '/images/default.jpg';
                console.error(`Failed to load avatar: ${user.Avatar}`);
              }}
            />
            <span className="user-name">{user.name || 'Пользователь'}</span>
            {isDrawerOpen && (
              <div className="drawer-menu">
                <Link to="/Profile" className="drawer-item" onClick={() => setIsDrawerOpen(false)}>
                  Профиль
                </Link>
                <Link to="/add-product" className="drawer-item" onClick={() => setIsDrawerOpen(false)}>
                  Опубликовать товар
                </Link>
                <Logout />
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
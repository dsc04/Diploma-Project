import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext'; 

const Logout = () => {
  const { logout } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); 
      console.log('вроде работает')
      navigate('/'); 
    } catch (e) {
      console.error("Ошибка при выходе:", e);
    }
  };

  return (
    <button onClick={handleLogout} className="btn btn-primary">
      Logout
    </button>
  );
};

export default Logout;

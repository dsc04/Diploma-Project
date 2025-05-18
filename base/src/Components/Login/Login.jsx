import React, { useState, useContext } from 'react';
import './adduser.css';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../../Context/AuthContext';

export const Login = () => {
  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      await login(user.email, user.password);
      toast.success('Вы вошли в аккаунт!');
      navigate('/');
    } catch (error) {
      toast.error('Ошибка при входе');
      console.error(error);
    }
  };

  return (
    <div className='add-user-container'>
      <div className='form-card'>
        <div className='form-header'>
          <h2>Вход</h2>
          <div className='form-decoration'></div>
        </div>

        <form className="user-form" onSubmit={submitForm}>
          <div className='form-group'>
            <input
              type="email"
              onChange={inputHandler}
              id="email"
              name="email"
              autoComplete='off'
              placeholder=' '
              required
            />
            <label htmlFor="email">Email</label>
            <div className='underline'></div>
          </div>

          <div className='form-group'>
            <input
              type="password"
              onChange={inputHandler}
              id="password"
              name="password"
              autoComplete='off'
              placeholder=' '
              required
            />
            <label htmlFor="password">Пароль</label>
            <div className='underline'></div>
          </div>

          <div className='form-actions'>
            <button type="submit" className='submit-btn'>
              <i className="fas fa-sign-in-alt"></i> Войти
            </button>

            <Link to='/' className='back-btn'>
              <i className="fas fa-arrow-left"></i> Назад
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

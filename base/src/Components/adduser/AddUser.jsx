import React, { useState } from 'react';
import "./adduser.css";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from "react-hot-toast";

export const AddUser = () => {
  const [user, setUser] = useState({
    name: "",
    password: "",
    email: "",
    description: ""
  });

  const navigate = useNavigate();

  const inputHandler = (e) => {
    const { name, value } = e.target;  // Исправлено: раньше было { email, value }, это ошибка
    setUser({ ...user, [name]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/registration", user);
      toast.success("Вы успешно зарегистрированы!");
      navigate("/Login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Ошибка при регистрации");
      console.error(error);
    }
  };

  return (
    <div className='add-user-container'>
      <div className='form-card'>
        <div className='form-header'>
          <h2>Регистрация</h2>
          <div className='form-decoration'></div>
        </div>

        <form className="user-form" onSubmit={submitForm}>
          <div className='form-group'>
            <input
              type="text"
              onChange={inputHandler}
              id="name"
              name="name"
              autoComplete='off'
              placeholder=' '
              required
            />
            <label htmlFor="name">Имя пользователя</label>
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
            <textarea
              onChange={inputHandler}
              id="description"
              name="description"
              autoComplete='off'
              placeholder=' '
              rows="3"
            ></textarea>
            <label htmlFor="description">Чем вы занимаетесь?</label>
            <div className='underline'></div>
          </div>

          <div className='form-actions'>
            <button type="submit" className='submit-btn'>
              <i className="fas fa-user-plus"></i> Зарегистрировать
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

export default AddUser;

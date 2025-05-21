import React from 'react';
import { Link } from 'react-router-dom';
import "./Header.css"

const Header = () => {
    return (
        <header>
            <h1><Link to="/">Hardpoint</Link></h1>
            <div className='HeaderButtons'>
            <Link to="/users" className="btn btn-primary">Посмотреть пользователей</Link>
            <Link to="/add" className="btn btn-success">Регистрация</Link>
            <Link to="/Profile" className="btn btn-success">Профиль</Link>
            <Link to="/Login" className="btn btn-success">Вход</Link>
            <Link to="/add-product" className="btn btn-success">Добавить товар</Link>
            </div>
        </header>
    );
};

export default Header;

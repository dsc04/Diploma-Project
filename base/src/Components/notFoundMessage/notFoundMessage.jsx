import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundMessage.css';

export default function NotFoundMessage() {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">
        404
      </h1>
      <p className="not-found-subtitle">
        Страница не найдена
      </p>
      <Link to="/" className="not-found-button">
        Вернуться на главную
      </Link>
    </div>
  );
}
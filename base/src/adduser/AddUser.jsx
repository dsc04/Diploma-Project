import React, { useState } from 'react';
import "./adduser.css";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

export const AddUser = () => {
  const users = {
      name:"",
      email:"",
      description:""
  };
const [user, setUser] = useState(users);
const navigate = useNavigate();
  
const inputHandler = (e)=>{
  const {name, value} = e.target 

  console.log(name, value);

  setUser({...user, [name]:value});
};

const submitForm = async(e)=>{
  e.preventDefault();
  await axios
  .post("http://localhost:8000/api/user",user)
  .then((response)=>{
    console.log("успешно создал пользователя")
    navigate("/");
  })
  .catch((error)=>{
    console.log(error)
  })
};

  return (
    <div className='addUser'>

      <h3>Окно Регистрации</h3>
      <form className = "addUserForm" onSubmit={submitForm}>
        <div className='inputGroup'>
          <label htmlFor="name"></label>
          <input 
          type="text"
          onChange={inputHandler}
          id="name"
          name="name"
          autoComplete='off'
          placeholder='Введи Свое Имя'
          />
        </div>
        <div className='inputGroup'>
          <label htmlFor="email"></label>
          <input 
          type="text"
          onChange={inputHandler}
          id="email"
          name="email"
          autoComplete='off'
          placeholder='Напиши свою почту'
          />
        <div className='inputGroup'>
          <label htmlFor="description"></label>
          <input 
          type="text"
          onChange={inputHandler}
          id="description"
          name="description"
          autoComplete='off'
          placeholder='Напииши описание'
          />
        </div>
      <div className='inputGroup'>
      <button type="submit" class="btn btn-primary">
        Зарегаться
      </button>
      </div>
        </div>
      </form>
        <Link to='/'type="button" class="btn btn-secondary">
          <i class="fa-solid fa-angle-left"></i>
        </Link>
    </div>
  );
};

export default AddUser;
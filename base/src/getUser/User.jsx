import React, { useEffect }from 'react';
import { useState } from "react";
import "./User.css";
import axios from "axios";
import { Link } from 'react-router-dom';
import Header from '../Components/Header/Header';

export const User = () => {

    const [users,setUsers] = useState([])
    useEffect(()=> {
        const fetchData = async () => { 
          try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8000/api/users", {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            setUsers(response.data);
          } catch (error) {
            console.log("Error While Fetching data", error);
          }
        }
        fetchData()
    },[])

  return (
    <div>
      <Header/>
       <div className='user-container'>
  <Link to="/add" className="add-user-btn">
    <i className="fa-regular fa-square-plus"></i>
    Add User
  </Link>
  
  <table className='user-table'>
    <thead>
      <tr>
        <th>S.No</th>
        <th>Name</th>
        <th>password</th>
        <th>Email</th>
        <th>Description</th>
        <th>profilepicture</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user, index) => (
        <tr key={user.id}>
          <td data-label="S.No">{index+1}</td>
          <td data-label="Name">{user.name}</td>
          <td data-label="password">{user.password}</td>
          <td data-label="Email">{user.email}</td>
          <td data-label="Description">{user.description}</td>
          <td data-label="profilepicture">{user.profilepicture}</td>
          <td className='action-buttons'>
            <Link to={'/'} className="action-btn edit-btn">
              <i className="fa-regular fa-pen-to-square"></i>
            </Link>
            <button className="action-btn delete-btn">
              <i className="fa-regular fa-trash-can"></i>
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </div>
  )
}

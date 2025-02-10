import React, { useEffect }from 'react';
import { useState } from "react";
import "./User.css";
import axios from "axios";
import { Link } from 'react-router-dom';

export const User = () => {

    const [users,setUsers] = useState([])
    useEffect(()=> {
        const fetchData = async()=>{
            try{
                const response = await axios.get("http://localhost:8000/api/users")
                setUsers(response.data)
            }catch(error){
                console.log("Error While Fetching data",error)
            }
        }
        fetchData()
    },[])

  return (
    <div className='userTable'>
            <Link to="/add" type="button" class="btn btn-primary">
                <i class="fa-regular fa-square-plus"></i>
            </Link>
        <table className='table table-bordered'>
            <thead>
                <tr>
                    <th scope = "col">S.No</th>
                    <th scope = "col">Name</th>
                    <th scope = "col">Email</th>
                    <th scope = "col">Description</th>
                    <th scope = "col">Actions</th>

                </tr>
            </thead>
            <tbody>
                {users.map((user, index)=> {
                    return(
                        <tr>
                        <td>
                            {index+1}
                        </td>
                        <td>
                            {user.name}
                        </td>
                        <td>
                        {user.email}
                        </td>
                        <td>
                        {user.description}
                        </td>
                        <td className='actionButtons'>
                            <button type="button" class="btn btn-success">
                                <i class="fa-regular fa-pen-to-square"></i>
                            </button>
                            <button type="button" class="btn btn-danger">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        </td>
    
                    </tr>
                    )
                })}

            </tbody>
        </table>
    </div>
  )
}

import './App.css';
import { User } from './getUser/User';
import { AddUser } from './adduser/AddUser';
import Home from './Components/HomePage/Home'
import Header from './Components/Header/Header';
import Profile from './Components/Profile/Profile.jsx';
import Login from './Components/Login/Login.jsx';
import { AuthProvider } from './Context/AuthContext.js'; // путь проверь
import {createBrowserRouter, RouterProvider} from "react-router-dom"

function App() {
  const route = createBrowserRouter ([
    {
      path:"/users",  
      element: <User/>
    },
    {
      path:"/add",
      element:<AddUser/>
    },
    {
      path:"/Profile",
      element:<Profile/>
    },
    {
      path:"/",
      element:<Home/>
    },
    {
      path:"/Login",
      element:<Login/>
    }
  ])
  return (
    <div className="App">
      <AuthProvider>
        <RouterProvider router={route} />
      </AuthProvider>
    </div>
        
  );
}

export default App;

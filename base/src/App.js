import './App.css';
import { User } from './Components/getUser/User.jsx';
import { AddUser } from './Components/adduser/AddUser.jsx';
import Home from './Components/HomePage/Home'
import Profile from './Components/Profile/Profile.jsx';
import Login from './Components/Login/Login.jsx';
import AddProduct from './Components/addProduct/addProduct.jsx';
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
    },
    {
      path:"/add-product",
      element:<AddProduct/>
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

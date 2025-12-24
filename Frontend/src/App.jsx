import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import { SellerLogin, UserLogin, AdminLogin } from './pages/Login'
import UserLayout from './layout/UserLayout'
import ProductPage from './pages/ProductPage'
import Product from "./pages/Product.jsx"
import CartPage from './pages/CartPage'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './pages/ProtectedRoute'
import SellerLayout from './layout/SellerLayout'
import SellerDashboard from './pages/SellerDasboard'
import SellerProducts from './pages/SellerProducts'
// import SellerOrders from './pages/seller/SellerOrders'
import SellerProfile from './pages/SellerProfile'
import { useDispatch } from 'react-redux'
import api from './api/api'
import { useEffect } from 'react'
import { login } from './slices/authSlice'

function App() {
  const dispatch = useDispatch();
  
  // Rehydrate auth state from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');
    const storedLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (storedLoggedIn && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        dispatch(login({ user: parsedUser, accessToken: storedToken }));
      } catch (err) {
        // Fallback if user was stored as a string
        dispatch(login({ user: storedUser, accessToken: storedToken }));
      }
    }
  }, []);

  useEffect(() => {
     api.post('/auth/health' );
  }, []);

 

  return (
    <Router>
      <Routes>
        {/* <Route element={<ProtectedRoute allowedRole="user" />} >
          <Route path="/profile" element={<ProfilePage />} />
        </Route> */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/login/seller" element={<SellerLogin />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/products/:category" element={<Product />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/user/profile" element={<ProfilePage />} />
        </Route>

        <Route path="/seller" element={<SellerLayout />}>
          <Route element={<ProtectedRoute allowedRole="seller" />}>
            <Route index element={<SellerDashboard />} />
          </Route>

          <Route path="products" element={<SellerProducts />} />
          {/* <Route path="orders" element={<SellerOrders />} /> */}
          <Route path="profile" element={<SellerProfile />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

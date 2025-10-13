import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import { SellerLogin, UserLogin, AdminLogin } from './pages/Login'
import UserLayout from './layout/UserLayout'
import ProductPage from './pages/ProductPage'
import Product from "./pages/Product.jsx"
import CartPage from './pages/CartPage'
import ProfilePage from './pages/ProfilePage'
import store from './store/store'
import { Provider } from 'react-redux'
import ProtectedRoute from './pages/protectedRoute'
import SellerLayout from './layout/SellerLayout'
import SellerDashboard from './pages/SellerDasboard'
import SellerProducts from './pages/SellerProducts'
// import SellerOrders from './pages/seller/SellerOrders'
import SellerProfile from './pages/SellerProfile'
// import {UserLogin,SellerLogin}

function App() {
  return (
    <Provider store={store}>
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
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="/seller" element={<SellerLayout />}>
            <Route index element={<SellerDashboard />} />
            <Route path="products" element={<SellerProducts />} />
            {/* <Route path="orders" element={<SellerOrders />} /> */}
            <Route path="profile" element={<SellerProfile />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  )
}

export default App

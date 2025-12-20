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
import { setCartItems } from './slices/cartSlice'
import api from './api/api'
import { useEffect } from 'react'

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
     api.post('/auth/health' );
  }, []);

  useEffect(() => {
    // Example API call to fetch initial data
    const fetchData = async () => {
      try {
        const response = await api.get('/users/cart');
        const cart = response.data?.cart || [];

        const normalizedItems = cart.map((item) => ({
          _id: item?.product?._id,
          productName: item?.product?.productName,
          price: item?.product?.price,
          image: item?.product?.images?.[0]?.url,
          quantity: item?.quantity ?? 0
        }));

        dispatch(setCartItems(normalizedItems));
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchData();
  }, [dispatch]);

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

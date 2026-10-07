import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Orders from './pages/Orders.jsx'
import OrderTracking from './pages/OrderTracking.jsx'
import UnboxingAnimation from './pages/UnboxingAnimation.jsx'
import Profile from './pages/Profile.jsx'
import Auth from './pages/Auth.jsx'
import { getToken } from './api.js'

// Giriş kontrolü yapan korumalı rota
function Protected({ children }) {
  return getToken() ? children : <Navigate to="/auth" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Protected><Cart /></Protected>} />
          <Route path="/checkout" element={<Protected><Checkout /></Protected>} />
          <Route path="/orders" element={<Protected><Orders /></Protected>} />
          <Route path="/orders/:id/track" element={<Protected><OrderTracking /></Protected>} />
          <Route path="/unbox/:orderId" element={<Protected><UnboxingAnimation /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

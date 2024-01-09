
import './App.css';
import Layout from './components/Layout';
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home"
import Cart from "./pages/cart/Cart"
import Favorites from "./pages/favorites/Favorites"
import Account from "./pages/AuthenticatedPages/account/Account";
import Login from './pages/login/Login';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/account" element={<Account/>} />
        <Route path='/login' element={<Login/>} />
      </Routes>
    </Layout>
  );
}

export default App;

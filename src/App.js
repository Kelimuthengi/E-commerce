import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Adminupload from './components/Adminupload';
import Allproducts from './components/Allproducts';
import Cart from './components/Cart';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/adminupload' element={<Adminupload/>}/>
        <Route path='/allproducts' element={<Allproducts/>}/>
        <Route path='/cart' element={<Cart/>}/>
      </Routes>
    </Router>
  );
}

export default App;

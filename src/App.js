import React from 'react';
import './App.css'
import Layout from "./Layout"
import Home from "./pages/Home"
import Users from "./pages/user"
import Login from './pages/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRouter';

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </Router>
  );
};

const MainLayout = () => {
  return (
    <Layout >
      <Routes>
        <Route path="/" exact name="Home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/about" exact name="Home" element={<PrivateRoute element={<Users />} />} />
      </Routes>
    </Layout>
  );
};
export default App;
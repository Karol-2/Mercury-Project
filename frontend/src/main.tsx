import ReactDOM from 'react-dom/client'
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import PageNotFound from './pages/PageNotFound.tsx';

import "./styles/styles.scss";

const body = document.getElementsByTagName('body')[0]!
body.className = "bg-my-darker text-my-light"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Router>
  <Routes>
    <Route path="/" element={<HomePage/>} />
    <Route path="/login" element={<LoginPage/>} />
    <Route path="/register" element={<RegisterPage/>} />
    <Route path="/*" element={<PageNotFound />} />
  </Routes>
</Router>
)

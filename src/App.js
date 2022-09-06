import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Axios from 'axios';
import './App.css';
import { Routes, Route } from 'react-router-dom'

import HomePages from './pages/homepages';
import LoginPages from './pages/loginpages';
import RegisterPages from './pages/registerpages';
import DetailPages from './pages/detailpages';
import CartPages from './pages/cartpages';
import HistoryPages from './pages/historypages';

function App() {
  const state = useSelector((state) => state.reducer)

  const dispatch = useDispatch()
  useEffect(() => {
    let id = localStorage.getItem('idUser')
    Axios.get(`http://localhost:2000/user/${id}`)
      .then(res => {
        dispatch({
          type: 'LOGIN',
          payload: res.data
        })
      })
  }, [dispatch])

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePages />} />
        <Route path="/login" element={<LoginPages />} />
        <Route path="/register" element={<RegisterPages />} />
        <Route path="/detail/:id" element={<DetailPages />} />
        <Route path="/cart" element={<CartPages />} />
        <Route path="/history" element={<HistoryPages />} />
      </Routes>
    </div>
  );
}

export default App;

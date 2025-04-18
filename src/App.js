import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import RecipeForm from './components/RecipeForm/RecipeForm';
import RecipeIndex from './components/RecipeIndex/RecipeIndex';
import Recipe from './components/Recipe/Recipe';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/recipe-form"
          element={
            isLoggedIn ? <RecipeForm /> : <Navigate to="/" />
          }
        />
        <Route
          path="/recipes"
          element={
            isLoggedIn ? <RecipeIndex /> : <Navigate to="/" />
          }
        />
        <Route
          path="/recipes/:id"
          element={
            isLoggedIn ? <Recipe /> : <Navigate to="/" />
          }
        />
        {/* catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React, { useState } from 'react';
import './Login.css';

export default function Login({ onLogin }) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fakeLoginAPI(userName, password);
 
    if (response.sucess) {
      onLogin();
    } else {
      alert('Invalid credentials');
    }
  };

  const fakeLoginAPI = (username, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid = username === 'admin' && password === 'password123';
        resolve({ success: isValid });
      }, 1000); // simulates a 1-second API delay
    });
  };
  

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Hunt to Hearth</h2>
        <input
          type="text"
          placeholder="NAME"
          className="name-input"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="PASSWORD"
          className="password-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Enter </button>
      </form>
    </div>
  );
}

import React, { useState } from 'react';
import './Login.css';

export default function Login({ onLogin }) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      userName === process.env.REACT_APP_USERNAME &&
      password === process.env.REACT_APP_PASSWORD
    ) {
      onLogin();
    } else {
      alert("Invalid credentials");
    }
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

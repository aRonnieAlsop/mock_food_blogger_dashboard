import React from 'react';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
        <div><button className="logout-button">LOGOUT</button></div>
        <div className="recipe-maker-entrance"><button>
            Enter New Recipe
        </button></div>
        
    </div>
  );
}

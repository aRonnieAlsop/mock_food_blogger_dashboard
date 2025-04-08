import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';


export default function Dashboard() {
  const navigate = useNavigate();

  const handleNewRecipeClick = () => {
    navigate('/recipe-form');
  }
  
  return (
    <div className="dashboard-container">
        <div className="recipe-index">Recipe Index</div>
        <div className="recipe-maker-entrance"><button onClick={handleNewRecipeClick}>
            Enter New Recipe
        </button>
        
        </div>
        <div className="logout">LOGOUT</div>
    </div>
  );
}

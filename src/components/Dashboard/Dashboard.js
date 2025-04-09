import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';


export default function Dashboard() {
  const navigate = useNavigate();

  const handleNewRecipeClick = () => {
    navigate('/recipe-form');
  }

  const handleRecipeIndexClick = () => {
    navigate('/recipes');
  }
  
  return (
    <div className="dashboard-container">
        <div className="recipe-index"><button onClick={handleRecipeIndexClick}>Recipe Index</button></div>
        <div className="recipe-maker-entrance"><button onClick={handleNewRecipeClick}>
            Enter New Recipe
        </button>
        
        </div>
        <div className="logout">LOGOUT</div>
    </div>
  );
}

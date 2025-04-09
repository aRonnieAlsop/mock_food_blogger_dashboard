import React, { useEffect, useState } from 'react';
import './RecipeIndex.css';

const RecipeIndex = () => {
    const [titles, setTitles] = useState([]); 

    useEffect(() => {
        fetch('http://localhost:4000/recipes')
          .then(res => res.json())
          .then(data => {
            setTitles(data.map(recipe => recipe.title));
          });
      }, []);
      
    return (
        <div className="recipes-list-container"><h1>Recipes</h1>
        <ul>
    {titles.map((title, idx) => (
      <li key={idx}>{title}</li>
    ))}
  </ul>
        </div>
        

    )
};

export default RecipeIndex;
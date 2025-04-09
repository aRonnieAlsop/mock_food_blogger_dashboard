import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Recipe.css';

const Recipe = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
  
    useEffect(() => {
      fetch(`http://localhost:4000/recipes`)
        .then(res => res.json())
        .then(data => {
          const found = data.find((r) => r.id === parseInt(id));
          setRecipe(found);
        });
    }, [id]);
  
    if (!recipe) return <p>Loading...</p>;
  
    return (
      <div className="recipe-detail-container">
        <h1 className="recipe-title">{recipe.title}</h1>
        <p className="recipe-description">{recipe.description}</p>
        <p className="recipe-author"><strong>Author:</strong> {recipe.author}</p>
  
        <div className="recipe-time-boxes">
          <div className="time-box">
            <span className="time-title">Prep Time</span>
            <p>{recipe.prepTime} mins</p>
          </div>
          <div className="time-box">
            <span className="time-title">Cook Time</span>
            <p>{recipe.cookTime} mins</p>
          </div>
        </div>
  
        <h3>Ingredients</h3>
        <ul className="ingredients-list">
          {recipe.ingredients.map((ing, idx) => (
            <li key={idx}>
              {ing.amount} {ing.measurement} {ing.name}
            </li>
          ))}
        </ul>
  
        <h3>Instructions</h3>
        <ol className="steps-list">
          {recipe.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
  
        {recipe.notes && (
          <>
            <h3>Notes</h3>
            <p className="notes">{recipe.notes}</p>
          </>
        )}
      </div>
    );
};

export default Recipe;
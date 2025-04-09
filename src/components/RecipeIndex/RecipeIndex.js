import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './RecipeIndex.css';

const RecipeIndex = () => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/recipes')
            .then(res => res.json())
            .then(data => {
                setRecipes(data); // ✅ store all recipe data
            });
    }, []);


    return (
        <div className="recipes-list-container">
            <div className="recipes-header">
                <h1>Recipes</h1>
            </div>
            <ul>
                {recipes.map((recipe) => (
                    <li key={recipe.id}>
                        <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
                    </li>
                ))}
            </ul>
        </div>


    )
};

export default RecipeIndex;
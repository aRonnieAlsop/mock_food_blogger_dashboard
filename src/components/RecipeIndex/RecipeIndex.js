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
                {recipes.map((recipe) => {
                    const createdAt = new Date(recipe.created_at);
                    const formattedDate = `${createdAt.getDate().toString().padStart(2, '0')}.${(createdAt.getMonth() + 1).toString().padStart(2, '0')}.${createdAt.getFullYear()}`;

                    return (
                        <li key={recipe.id} className="recipe-item">
                            <Link to={`/recipes/${recipe.id}`} className="recipe-link">
                                <span className="title">{recipe.title}</span>
                                <span className="date">{formattedDate}</span>
                            </Link>
                        </li>
                    );
                })}

            </ul>
        </div>


    )
};

export default RecipeIndex;
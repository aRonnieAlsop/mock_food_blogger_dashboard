import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditRecipeForm.css';

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    title: '',
    author: '',
    description: '',
    prepTime: '',
    cookTime: '',
    ingredients: [{ amount: '', measurement: '', name: '' }],
    steps: [''],
    notes: '',
    image: null
  });

  useEffect(() => {
    fetch(`http://localhost:4000/recipes`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((r) => r.id === parseInt(id));
        if (found) {
          found.ingredients = JSON.parse(found.ingredients);
          found.steps = JSON.parse(found.steps);
          setRecipe(found);
        }
      });
  }, [id]);

  const handleIngredientChange = (index, field, value) => {
    const updated = [...recipe.ingredients];
    updated[index][field] = value;
    setRecipe({ ...recipe, ingredients: updated });
  };

  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { amount: '', measurement: '', name: '' }]
    });
  };

  const removeIngredient = (index) => {
    const updated = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe({ ...recipe, ingredients: updated });
  };

  const handleStepChange = (index, value) => {
    const updated = [...recipe.steps];
    updated[index] = value;
    setRecipe({ ...recipe, steps: updated });
  };

  const addStep = () => {
    setRecipe({ ...recipe, steps: [...recipe.steps, ''] });
  };

  const removeStep = (index) => {
    const updated = recipe.steps.filter((_, i) => i !== index);
    setRecipe({ ...recipe, steps: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedRecipe = {
      ...recipe,
      ingredients: JSON.stringify(recipe.ingredients),
      steps: JSON.stringify(recipe.steps)
    };

    try {
      const res = await fetch(`http://localhost:4000/recipes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRecipe)
      });

      if (res.ok) {
        navigate(`/recipes/${id}`); // Redirect back to the recipe details page
      } else {
        console.error('Failed to update recipe.');
      }
    } catch (err) {
      console.error('Error updating recipe:', err);
    }
  };

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="recipe-form-container">
      <form onSubmit={handleSubmit} className="recipe-card">
        <h2>Edit Recipe</h2>

        <label>Title</label>
        <input
          type="text"
          value={recipe.title}
          onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
          required
        />

        <label>Author</label>
        <input
          type="text"
          value={recipe.author}
          onChange={(e) => setRecipe({ ...recipe, author: e.target.value })}
        />

        <label>Description</label>
        <textarea
          value={recipe.description}
          onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
        />

        <label>Prep Time (minutes)</label>
        <input
          type="number"
          value={recipe.prepTime}
          onChange={(e) => setRecipe({ ...recipe, prepTime: e.target.value })}
          required
        />

        <label>Cook Time (minutes)</label>
        <input
          type="number"
          value={recipe.cookTime}
          onChange={(e) => setRecipe({ ...recipe, cookTime: e.target.value })}
          required
        />

        <h3>Ingredients</h3>
        {recipe.ingredients.map((ingredient, index) => (
          <div className="ingredient-row" key={index}>
            <input
              type="text"
              value={ingredient.amount}
              onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
              placeholder="Amount"
            />
            <input
              type="text"
              value={ingredient.measurement}
              onChange={(e) => handleIngredientChange(index, 'measurement', e.target.value)}
              placeholder="Measurement"
            />
            <input
              type="text"
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              placeholder="Ingredient"
            />
            <button type="button" onClick={() => removeIngredient(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addIngredient}>+ Add Ingredient</button>

        <h3>Instructions</h3>
        {recipe.steps.map((step, index) => (
          <div key={index}>
            <textarea
              value={step}
              onChange={(e) => handleStepChange(index, e.target.value)}
              placeholder={`Step ${index + 1}`}
            />
            <button type="button" onClick={() => removeStep(index)}>Remove Step</button>
          </div>
        ))}
        <button type="button" onClick={addStep}>+ Add Step</button>
        <div className="checkbox-group">
  <h3>This recipe is:</h3>
  <div>
    <input
      type="checkbox"
      checked={recipe.is_gluten_free === 'YES'}
      onChange={(e) =>
        setRecipe({ ...recipe, is_gluten_free: e.target.checked ? 'YES' : 'N/A' })
      }
    />
    <label>Gluten Free</label>
  </div>
  <div>
    <input
      type="checkbox"
      checked={recipe.is_vegan === 'YES'}
      onChange={(e) =>
        setRecipe({ ...recipe, is_vegan: e.target.checked ? 'YES' : 'N/A' })
      }
    />
    <label>Vegan</label>
  </div>
  <div>
    <input
      type="checkbox"
      checked={recipe.is_dairy_free === 'YES'}
      onChange={(e) =>
        setRecipe({ ...recipe, is_dairy_free: e.target.checked ? 'YES' : 'N/A' })
      }
    />
    <label>Dairy Free</label>
  </div>
  <div>
    <input
      type="checkbox"
      checked={recipe.is_vegetarian === 'YES'}
      onChange={(e) =>
        setRecipe({ ...recipe, is_vegetarian: e.target.checked ? 'YES' : 'N/A' })
      }
    />
    <label>Vegetarian</label>
  </div>
</div>

<div className="checkbox-group">
  <h3>Can be easily modified to be:</h3>
  <div>
    <input
      type="checkbox"
      checked={recipe.can_be_gluten_free === 'YES'}
      onChange={(e) =>
        setRecipe({ ...recipe, can_be_gluten_free: e.target.checked ? 'YES' : 'N/A' })
      }
    />
    <label>Gluten Free</label>
  </div>
  <div>
    <input
      type="checkbox"
      checked={recipe.can_be_vegan === 'YES'}
      onChange={(e) =>
        setRecipe({ ...recipe, can_be_vegan: e.target.checked ? 'YES' : 'N/A' })
      }
    />
    <label>Vegan</label>
  </div>
  <div>
    <input
      type="checkbox"
      checked={recipe.can_be_dairy_free === 'YES'}
      onChange={(e) =>
        setRecipe({ ...recipe, can_be_dairy_free: e.target.checked ? 'YES' : 'N/A' })
      }
    />
    <label>Dairy Free</label>
  </div>
  <div>
    <input
      type="checkbox"
      checked={recipe.can_be_vegetarian === 'YES'}
      onChange={(e) =>
        setRecipe({ ...recipe, can_be_vegetarian: e.target.checked ? 'YES' : 'N/A' })
      }
    />
    <label>Vegetarian</label>
  </div>
</div>

        <h3>Notes</h3>
        <textarea
          value={recipe.notes}
          onChange={(e) => setRecipe({ ...recipe, notes: e.target.value })}
        />

        <button type="submit">Submit Edits</button>
      </form>
    </div>
  );
};

export default EditRecipe;

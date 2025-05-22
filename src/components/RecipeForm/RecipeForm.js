import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecipeForm.css';

const US_MEASUREMENTS = ['cup', 'tablespoon', 'teaspoon', 'lb', 'oz', 'pinch', 'clove', 'slice', 'piece', 'head', 'can', ''];

export default function RecipeForm() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState([{ amount: '', measurement: 'cup', name: '' }]);
    const [steps, setSteps] = useState(['']);
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [notes, setNotes] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [image, setImage] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const [isGlutenFree, setGlutenFree] = useState(false);
    const [isVegan, setVegan] = useState(false);
    const [isDairyFree, setDairyFree] = useState(false);
    const [isVegetarian, setVegetarian] = useState(false);


    const [canBeGlutenFree, setCanBeGlutenFree] = useState(false);
    const [canBeVegan, setCanBeVegan] = useState(false);
    const [canBeDairyFree, setCanBeDairyFree] = useState(false);
    const [canBeVegetarian, setCanBeVegetarian] = useState(false);

    const handleRecipeIndexClick = () => {
        navigate('/recipes');
    }

    const handleIngredientChange = (index, field, value) => {
        const updated = [...ingredients];
        updated[index][field] = value;
        setIngredients(updated);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { amount: '', measurement: 'cup', name: '' }]);
    };

    const addStep = () => {
        setSteps([...steps, '']);
    };

    const handleStepChange = (index, value) => {
        const updated = [...steps];
        updated[index] = value;
        setSteps(updated);
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', image);
        formData.append('title', title);
        formData.append('author', author);
        formData.append('description', description);
        formData.append('prepTime', prepTime);
        formData.append('cookTime', cookTime);
        formData.append('ingredients', JSON.stringify(ingredients));
        formData.append('steps', JSON.stringify(steps));
        formData.append('notes', notes);


        formData.append('is_gluten_free', isGlutenFree ? 'YES' : 'N/A');
        formData.append('is_vegan', isVegan ? 'YES' : 'N/A');
        formData.append('is_dairy_free', isDairyFree ? 'YES' : 'N/A');
        formData.append('is_vegetarian', isVegetarian ? 'YES' : 'N/A');
        formData.append('can_be_gluten_free', canBeGlutenFree ? 'YES' : 'N/A');
        formData.append('can_be_vegan', canBeVegan ? 'YES' : 'N/A');
        formData.append('can_be_dairy_free', canBeDairyFree ? 'YES' : 'N/A');
        formData.append('can_be_vegetarian', canBeVegetarian ? 'YES' : 'N/A');


        try {
            const res = await fetch('http://localhost:4000/recipes', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            console.log('Saved to DB:', data);
            setSubmitted(true);
        } catch (err) {
            console.error('Failed to save recipe:', err);
        }
    };

    const closeModal = () => {
        setSubmitted(false);
        setTitle('');
        setIngredients([{ amount: '', measurement: 'cup', name: '' }]);
        setSteps(['']);
        setAuthor('');
        setDescription('');
        setNotes('');
        setPrepTime('');
        setCookTime('');
        setImage(null);
    };

    return (
        <div className="recipe-form-container">
            <div className="recipes-idx-link"><button onClick={handleRecipeIndexClick}>Recipe Index</button></div>
            <form onSubmit={handleSubmit} className="recipe-card">
                <h2>Recipe Title</h2>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Roasted Garlic Pasta"
                    className="title-input"
                    required
                />

                <label htmlFor="author">Author</label>
                <input
                    type="text"
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g., Hunt to Hearth"
                    className="author-input"
                />

                <label htmlFor="description">Short Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A simple, flavorful pasta dish with roasted garlic and herbs."
                    className="description-input"
                />

                <h3>Time</h3>
                <div className="time-inputs">
                    <div>
                        <label htmlFor="prepTime">Prep Time (minutes)</label>
                        <input
                            type="number"
                            id="prepTime"
                            value={prepTime}
                            onChange={(e) => setPrepTime(e.target.value)}
                            min="0"
                            className="time-input"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="cookTime">Cook Time (minutes)</label>
                        <input
                            type="number"
                            id="cookTime"
                            value={cookTime}
                            onChange={(e) => setCookTime(e.target.value)}
                            min="0"
                            className="time-input"
                            required
                        />
                    </div>
                </div>

                {/* Ingredients Section */}
                <h3>Ingredients</h3>
                {ingredients.map((ingredient, index) => (
                    <div className="ingredient-row" key={index}>
                        <input
                            type="text"
                            value={ingredient.amount}
                            onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                            placeholder="1/2"
                            className="ingredient-amount"
                        />
                        <select
                            value={ingredient.measurement}
                            onChange={(e) => handleIngredientChange(index, 'measurement', e.target.value)}
                            className="ingredient-measurement"
                        >
                            {US_MEASUREMENTS.map((unit) => (
                                <option key={unit} value={unit}>{unit}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={ingredient.name}
                            onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                            placeholder="e.g., garlic"
                            className="ingredient-name"
                            required
                        />
                    </div>
                ))}
                <button type="button" onClick={addIngredient} className="recipe-form-button">+ Add Ingredient</button>
                                <h3>Instructions</h3>
                {steps.map((step, index) => (
                    <div className="step-row" key={index}>
                        <label>Step {index + 1}</label>
                        <textarea
                            value={step}
                            onChange={(e) => handleStepChange(index, e.target.value)}
                            placeholder="Describe this step..."
                            required
                        />
                    </div>
                ))}
                <button type="button" onClick={addStep} className="recipe-form-button">+ Add Step</button>
                {/* "This Recipe is" Section */}
                <div className="checkbox-group">
                    <h3>This recipe is:</h3>
                    <div>
                        <input type="checkbox" className="checkbox-GF" checked={isGlutenFree} onChange={(e) => setGlutenFree(e.target.checked)} />
                        <label>Gluten Free</label>
                    </div>
                    <div>
                        <input type="checkbox" className="checkbox-V" checked={isVegan} onChange={(e) => setVegan(e.target.checked)} />
                        <label>Vegan</label>
                    </div>
                    <div>
                        <input type="checkbox" className="checkbox-DF" checked={isDairyFree} onChange={(e) => setDairyFree(e.target.checked)} />
                        <label>Dairy Free</label>
                    </div>
                    <div>
                        <input type="checkbox" className="checkbox-VG" checked={isVegetarian} onChange={(e) => setVegetarian(e.target.checked)} />
                        <label>Vegetarian</label>
                    </div>
                </div>
                {/* "Can be easily modified to be" Section */}
                <div className="checkbox-group">
                    <h3>Can be easily modified to be:</h3>
                    <div>
                        <input type="checkbox" className="checkbox-can-be-GF" checked={canBeGlutenFree} onChange={(e) => setCanBeGlutenFree(e.target.checked)} />
                        <label>Gluten Free</label>
                    </div>
                    <div>
                        <input type="checkbox" className="checkbox-can-be-V" checked={canBeVegan} onChange={(e) => setCanBeVegan(e.target.checked)} />
                        <label>Vegan</label>
                    </div>
                    <div>
                        <input type="checkbox" className="checkbox-can-be-DF" checked={canBeDairyFree} onChange={(e) => setCanBeDairyFree(e.target.checked)} />
                        <label>Dairy Free</label>
                    </div>
                    <div>
                        <input type="checkbox" className="checkbox-can-be-VG" checked={canBeVegetarian} onChange={(e) => setCanBeVegetarian(e.target.checked)} />
                        <label>Vegetarian</label>
                    </div>
                </div>
                <h3>Notes</h3>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional notes, substitutions, or personal tips."
                    className="notes-input"
                />
                <div className="upload-area">
                    <h3>Upload an Image</h3>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                </div>

                <button type="submit" className="recipe-form-button">Submit Recipe</button>
            </form>

            {submitted && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Recipe Submitted Successfully!</h3>
                        <button className="close-btn" onClick={closeModal}>X</button>
                    </div>
                </div>
            )}
        </div>
    );
}

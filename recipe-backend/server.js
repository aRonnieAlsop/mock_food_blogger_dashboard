const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./recipes.db', (err) => {
    if (err) return console.error(err.message);
    console.log('Connected to the recipes database.');
  });

db.run(`
    CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        author TEXT,
        description TEXT,
        prepTime INTEGER,
        cookTime INTEGER,
        ingredients TEXT,
        steps TEXT,
        notes TEXT)`
);

app.post('/recipes', (req, res) => {
    const { title, author, description, prepTime, cookTime, ingredients, steps, notes } = req.body;

    const query = `
        INSERT INTO recipes (title, author, description, prepTime, cookTime, ingredients, steps, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;


    db.run(
        query,
        [
            title,
            author,
            description,
            prepTime,
            cookTime,
            JSON.stringify(ingredients),
            JSON.stringify(steps),
            notes
        ],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
        }
    );
});

app.get('/recipes', (req, res) => {
    db.all(`SELECT * FROM recipes`, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const formatted = rows.map(recipe => ({
        ...recipe,
        ingredients: JSON.parse(recipe.ingredients),
        steps: JSON.parse(recipe.steps)
      }));
      res.json(formatted);
    });
  });

  app.delete('/recipes/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM recipes WHERE id = ?`, id, function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, deletedId: id });
    });
  });
  
  

app.listen(port, () => {
    console.log(`Server running on localhost:${port}`);
});
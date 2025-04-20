const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use(express.static('uploads')); 

const db = new sqlite3.Database('./recipes.db', (err) => {
    if (err) return console.error(err.message);
    console.log('Connected to the recipes database.');
  });

  const uploadDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir); 
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); 
    }
  });

  const upload = multer({ storage: storage });

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
        notes TEXT,
        image TEXT,
        created_at TEXT
        )`
);

app.post('/recipes', (req, res) => {
    const { title, author, description, prepTime, cookTime, ingredients, steps, notes } = req.body;

    const createdAt = new Date().toISOString();

    const imagePath = req.file ? path.join('uploads', req.file.filename) : null;

    const query = `
        INSERT INTO recipes (title, author, description, prepTime, cookTime, ingredients, steps, notes, image, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        console.log('Saving recipe with date:', createdAt);

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
            notes,
            imagePath,
            createdAt
        ],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Recipe saved successfully', id: this.lastID });
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
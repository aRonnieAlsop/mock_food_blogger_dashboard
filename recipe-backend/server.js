const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const app = express();
const port = 4000;

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(express.static('uploads'));  // Serve images from the 'uploads' folder

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
        cb(null, uploadDir);  // Store uploaded files in the 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));  // Unique filename based on timestamp
    }
});

const upload = multer({ storage: storage });

// Create recipes table if it doesn't exist
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

// POST endpoint for recipe submission 
app.post('/recipes', upload.single('image'), (req, res) => {
  const { title, author, description, prepTime, cookTime, ingredients, steps, notes } = req.body;
  const createdAt = new Date().toISOString();

  
  const imagePath = req.file ? path.join('uploads', req.file.filename) : null;

  if (imagePath) {
      /* compress uploaded img w/ sharp*/
      const compressedImagePath = path.join('uploads', 'compressed_' + req.file.filename);

      sharp(req.file.path)
          .resize(800)  
          .toFile(compressedImagePath, (err, info) => {
              if (err) {
                  console.error('Error compressing image:', err);
                  return res.status(500).json({ error: 'Failed to compress image', details: err.message });
              }

              /* saved w/ compressed img path*/
              const query = `
                  INSERT INTO recipes (title, author, description, prepTime, cookTime, ingredients, steps, notes, image, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                      notes,
                      compressedImagePath, /* storing compressed img path */
                      createdAt
                  ],
                  function (err) {
                      if (err) {
                          console.error('Error saving recipe:', err.message);
                          return res.status(500).json({ error: 'Failed to save recipe', details: err.message });
                      }
                      res.status(200).json({ message: 'Recipe saved successfully', id: this.lastID });
                  }
              );
          });
  } else {
      /* if no image uploaded, just save recipe w/out it */
      const query = `
          INSERT INTO recipes (title, author, description, prepTime, cookTime, ingredients, steps, notes, image, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
              notes,
              null, 
              createdAt
          ],
          function (err) {
              if (err) {
                  console.error('Error saving recipe:', err.message);
                  return res.status(500).json({ error: 'Failed to save recipe', details: err.message });
              }
              res.status(200).json({ message: 'Recipe saved successfully', id: this.lastID });
          }
      );
  }
});

// GET endpoint for fetching all recipes
app.get('/recipes', (req, res) => {
    db.all(`SELECT * FROM recipes`, [], (err, rows) => {
        if (err) {
            console.error('Error fetching recipes:', err.message);
            return res.status(500).json({ error: 'Failed to fetch recipes', details: err.message });
        }
        const formatted = rows.map(recipe => ({
            ...recipe,
            ingredients: JSON.parse(recipe.ingredients),
            steps: JSON.parse(recipe.steps)
        }));
        res.json(formatted);
    });
});

// DELETE endpoint for deleting a recipe by ID
app.delete('/recipes/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM recipes WHERE id = ?`, id, function (err) {
        if (err) {
            console.error('Error deleting recipe:', err.message);
            return res.status(500).json({ error: 'Failed to delete recipe', details: err.message });
        }
        res.json({ success: true, deletedId: id });
    });
});

app.listen(port, () => {
    console.log(`Server running on localhost:${port}`);
});

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
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // Serves images from the 'uploads' folder

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
        created_at TEXT,
        is_gluten_free TEXT,
        is_vegan TEXT,
        is_dairy_free TEXT,
        is_vegetarian TEXT,
        can_be_gluten_free TEXT,
        can_be_vegan TEXT,
        can_be_dairy_free TEXT,
        can_be_vegetarian TEXT
    )`
);

app.post('/recipes', upload.single('image'), (req, res) => {
  const {
    title,
    author,
    description,
    prepTime,
    cookTime,
    ingredients,
    steps,
    notes,
    is_gluten_free,
    is_vegan,
    is_dairy_free,
    is_vegetarian,
    can_be_gluten_free,
    can_be_vegan,
    can_be_dairy_free,
    can_be_vegetarian
  } = req.body;

  const createdAt = new Date().toISOString();
  const imagePath = req.file ? path.join('uploads', req.file.filename) : null;

  if (imagePath) {
    const compressedImagePath = path.join('uploads', 'compressed_' + req.file.filename);

    sharp(req.file.path)
      .resize(800)
      .toFile(compressedImagePath, (err, info) => {
        if (err) {
          console.error('Error compressing image:', err);
          return res.status(500).json({ error: 'Failed to compress image', details: err.message });
        }

        fs.unlinkSync(req.file.path);

        const query = `
          INSERT INTO recipes (title, author, description, prepTime, cookTime, ingredients, steps, notes, image, created_at, is_gluten_free, is_vegan, is_dairy_free, is_vegetarian, can_be_gluten_free, can_be_vegan, can_be_dairy_free, can_be_vegetarian)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(
          query,
          [
            title,
            author,
            description,
            prepTime,
            cookTime,
            JSON.stringify(JSON.parse(ingredients)),
            JSON.stringify(JSON.parse(steps)),
            notes,
            compressedImagePath,
            createdAt,
            is_gluten_free,
            is_vegan,
            is_dairy_free,
            is_vegetarian,
            can_be_gluten_free,
            can_be_vegan,
            can_be_dairy_free,
            can_be_vegetarian
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
    const query = `
      INSERT INTO recipes (title, author, description, prepTime, cookTime, ingredients, steps, notes, image, created_at, is_gluten_free, is_vegan, is_dairy_free, is_vegetarian, can_be_gluten_free, can_be_vegan, can_be_dairy_free, can_be_vegetarian)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        createdAt,
        is_gluten_free,
        is_vegan,
        is_dairy_free,
        is_vegetarian,
        can_be_gluten_free,
        can_be_vegan,
        can_be_dairy_free,
        can_be_vegetarian
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

app.post('/recipes', upload.single('image'), (req, res) => {
    console.log('Received POST /recipes');
console.log('req.body:', req.body);
console.log('req.file:', req.file);
    const { title, author, description, prepTime, cookTime, ingredients, steps, notes } = req.body;
    const createdAt = new Date().toISOString();

    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }


    const imagePath = path.join('uploads', req.file.filename); 

    
    const compressedImagePath = path.join('uploads', 'compressed_' + req.file.filename);

    sharp(req.file.path)
        .resize(800) 
        .toFile(compressedImagePath, (err, info) => {
            if (err) {
                console.error('Error compressing image:', err);
                return res.status(500).json({ error: 'Failed to compress image', details: err.message });
            }

            fs.unlinkSync(req.file.path);

          
            const query = `
                INSERT INTO recipes (title, author, description, prepTime, cookTime, ingredients, steps, notes, image, created_at, is_gluten_free, is_vegan, is_dairy_free, is_vegetarian, can_be_gluten_free, can_be_vegan, can_be_dairy_free, can_be_vegetarian)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                    compressedImagePath, 
                    createdAt,
                    isGlutenFree ? 'YES' : 'N/A',
                      isVegan ? 'YES' : 'N/A',
                      isDairyFree ? 'YES' : 'N/A',
                      isVegetarian ? 'YES' : 'N/A',
                      canBeGlutenFree ? 'YES' : 'N/A',
                      canBeVegan ? 'YES' : 'N/A',
                      canBeDairyFree ? 'YES' : 'N/A',
                      canBeVegetarian ? 'YES' : 'N/A',
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

app.put('/recipes/:id', (req, res) => {
  const {
    title,
    author,
    description,
    prepTime,
    cookTime,
    ingredients,
    steps,
    notes,
    is_gluten_free,
    is_vegan,
    is_dairy_free,
    is_vegetarian,
    can_be_gluten_free,
    can_be_vegan,
    can_be_dairy_free,
    can_be_vegetarian
  } = req.body;

  const id = req.params.id;

  const query = `
    UPDATE recipes
    SET title = ?, author = ?, description = ?, prepTime = ?, cookTime = ?, ingredients = ?, steps = ?, notes = ?,
        is_gluten_free = ?, is_vegan = ?, is_dairy_free = ?, is_vegetarian = ?,
        can_be_gluten_free = ?, can_be_vegan = ?, can_be_dairy_free = ?, can_be_vegetarian = ?
    WHERE id = ?
  `;

  db.run(
    query,
    [
      title,
      author,
      description,
      prepTime,
      cookTime,
      ingredients,
      steps,
      notes,
      is_gluten_free,
      is_vegan,
      is_dairy_free,
      is_vegetarian,
      can_be_gluten_free,
      can_be_vegan,
      can_be_dairy_free,
      can_be_vegetarian,
      id
    ],
    function (err) {
      if (err) {
        console.error('Error updating recipe:', err.message);
        return res.status(500).json({ error: 'Failed to update recipe', details: err.message });
      }
      res.json({ message: 'Recipe updated successfully' });
    }
  );
});


app.listen(port, () => {
    console.log(`Server running on localhost:${port}`);
});

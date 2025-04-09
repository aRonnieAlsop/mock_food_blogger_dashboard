# Hunt to Hearth — Recipe Admin Dashboard

This is the internal dashboard used by the food blogger to **create**, **manage**, and **delete** recipes for the Hunt to Hearth blog. It is not the public-facing blog — it serves as a backend tool that powers future blog content.

---

## 📸 Features

- 🧾 Submit a new recipe through a custom structured form
- 🗂 View all existing recipes with title and creation date
- 🗑 Delete recipes directly from their detail page
- 📅 Created date is auto-generated when the recipe is submitted
- 🖋 Structured entry mimics Minimalist Baker’s recipe format
- 🔐 Mock login page (single user only)

---

## 🧱 Tech Stack

- **Frontend:** React 19
- **Backend:** Node.js + Express
- **Database:** SQLite
- **Styling:** Custom CSS, inspired by food magazine layouts

---

## 🗂 File Structure

- `/client` — React frontend
  - `Login.js` — mock sign-in page
  - `Dashboard.js` — main admin entry view
  - `RecipeForm.js` — structured recipe input form
  - `RecipeIndex.js` — list of recipes with clickable titles
  - `RecipeDetail.js` — single recipe view + delete option

- `server.js` — Express backend with SQLite
  - Handles POST, GET, DELETE routes for recipes
  - Auto-generates ISO `created_at` timestamps

---

## 🚀 Getting Started

### Prerequisites:
- Node.js and npm installed
- SQLite or SQLite Studio

### 1. Install dependencies

```bash
cd client
npm install

cd ..
npm install
```

### 2. Start the backend

```bash
node server.js
```
Creates recipes.db with table if it doesn't exist.

### 3. Start the frontend

```bash
cd client
npm start
```
## 🔐 Login Credentials

- **Username:** orion 
- **Password:** 1234

These credentials are stored in a `.env` file and are used to grant access to the dashboard. There is no real authentication in place—this is purely for mock/demo purposes.
You can change these in the .env file in the root directory.

> ⚠️ Do not use this method for real user authentication. It's intended for development or personal-use projects only.

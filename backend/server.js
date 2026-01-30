const express = require('express');
const connectDB = require('../config/db');
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');

const PORT = process.env.PORT || 4000;
const app = express();
connectDB();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
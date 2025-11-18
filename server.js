const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection String (replace with your MongoDB Atlas connection string)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/school?retryWrites=true&w=majority';

let db;

// Connect to MongoDB
MongoClient.connect(MONGODB_URI)
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db('school'); // Database name
  })
  .catch(error => console.error('MongoDB connection error:', error));

// ============================================
// MIDDLEWARE FUNCTIONS (8% requirement)
// ============================================

// 1. Logger Middleware (4%)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  console.log('-----------------------------------');
  next();
});

// CORS Middleware
app.use(cors());

// JSON Parser Middleware
app.use(express.json());

// 2. Static File Middleware (4%)
app.use('/images', (req, res, next) => {
  const imagePath = path.join(__dirname, 'public', 'images', req.path);
  const fs = require('fs');
  
  // Check if file exists
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(`Image not found: ${req.path}`);
      return res.status(404).json({ 
        error: 'Image not found',
        path: req.path 
      });
    }
    // File exists, serve it
    res.sendFile(imagePath);
  });
});

// ============================================
// REST API ROUTES (12% requirement)
// ============================================

// 1. GET /lessons - Return all lessons (3%)
app.get('/lessons', async (req, res) => {
  try {
    const lessons = await db.collection('lessons').find({}).toArray();
    res.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// 2. POST /orders - Save a new order (4%)
app.post('/orders', async (req, res) => {
  try {
    const order = {
      name: req.body.name,
      phone: req.body.phone,
      lessonIDs: req.body.lessonIDs, // Array of lesson IDs
      numberOfSpaces: req.body.numberOfSpaces, // Array or single number
      createdAt: new Date()
    };

    const result = await db.collection('orders').insertOne(order);
    
    res.status(201).json({
      message: 'Order created successfully',
      orderId: result.insertedId,
      order: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// 3. PUT /lessons/:id - Update lesson spaces (5%)
app.put('/lessons/:id', async (req, res) => {
  try {
    const lessonId = req.params.id;
    const { availableSeats } = req.body;

    // Validate input
    if (availableSeats === undefined) {
      return res.status(400).json({ error: 'availableSeats is required' });
    }

    // Update the lesson with the new availableSeats value
    const result = await db.collection('lessons').updateOne(
      { id: parseInt(lessonId) },
      { $set: { availableSeats: availableSeats } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json({
      message: 'Lesson updated successfully',
      lessonId: lessonId,
      newAvailableSeats: availableSeats
    });
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

// ============================================
// SEARCH FUNCTIONALITY (10% - Challenge Component)
// ============================================

// GET /search - Full-text search across lessons (7% backend + 3% frontend)
app.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.q;

    if (!searchQuery) {
      return res.status(400).json({ error: 'Search query parameter "q" is required' });
    }

    console.log(`Searching for: "${searchQuery}"`);

    // Create a case-insensitive regex pattern
    const regex = new RegExp(searchQuery, 'i');

    // Search across multiple fields
    const lessons = await db.collection('lessons').find({
      $or: [
        { title: regex },
        { location: regex },
        { description: regex },
        { price: isNaN(searchQuery) ? null : parseFloat(searchQuery) },
        { availableSeats: isNaN(searchQuery) ? null : parseInt(searchQuery) }
      ]
    }).toArray();

    console.log(`Found ${lessons.length} results`);

    res.json({
      query: searchQuery,
      count: lessons.length,
      results: lessons
    });
  } catch (error) {
    console.error('Error searching lessons:', error);
    res.status(500).json({ error: 'Failed to search lessons' });
  }
});

// ============================================
// ROOT ROUTE
// ============================================

app.get('/', (req, res) => {
  res.json({
    message: 'CST3144 Backend API',
    endpoints: {
      lessons: 'GET /lessons',
      createOrder: 'POST /orders',
      updateLesson: 'PUT /lessons/:id',
      search: 'GET /search?q=query'
    }
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access at: http://localhost:${PORT}`);
});
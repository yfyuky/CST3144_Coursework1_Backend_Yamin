// CST3144 Backend Server
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
let db;

MongoClient.connect(MONGODB_URI)
  .then(client => {
    console.log('✅ Connected to MongoDB');
    db = client.db('school');
  })
  .catch(error => console.error('❌ MongoDB error:', error));

// Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  console.log('---');
  next();
});

// CORS Configuration
app.use(cors({
  origin: [
    'https://yfyuky.github.io',
    'https://cst3144-coursework1-backend-yamin.onrender.com',
    'http://127.0.0.1:5500'
  ],
  methods: ['GET', 'POST', 'PUT'],
  credentials: true
}));

app.use(express.json());

// Static file handler for images
app.use('/images', (req, res) => {
  const imagePath = path.join(__dirname, 'public', 'images', req.path);
  
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(`❌ Image not found: ${req.path}`);
      return res.status(404).json({ 
        error: 'Image not found',
        path: req.path 
      });
    }
    res.sendFile(imagePath);
  });
});

// API ROUTES

app.get('/', (req, res) => {
  res.json({
    message: 'CST3144 Backend API',
    endpoints: {
      'GET /lessons': 'Get all lessons',
      'POST /orders': 'Create order',
      'PUT /lessons/:id': 'Update lesson spaces',
      'GET /search?q=query': 'Search lessons'
    }
  });
});

// GET /lessons
app.get('/lessons', async (req, res) => {
  try {
    const lessons = await db.collection('lessons').find({}).toArray();
    console.log(`✅ Returned ${lessons.length} lessons`);
    res.json(lessons);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// POST /orders
app.post('/orders', async (req, res) => {
  try {
    const order = {
      name: req.body.name,
      phone: req.body.phone,
      lessonIDs: req.body.lessonIDs,
      numberOfSpaces: req.body.numberOfSpaces,
      createdAt: new Date()
    };

    const result = await db.collection('orders').insertOne(order);
    console.log(`✅ Order created: ${result.insertedId}`);
    
    res.status(201).json({
      message: 'Order created successfully',
      orderId: result.insertedId
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// PUT /lessons/:id — set exact availableSeats
app.put('/lessons/:id', async (req, res) => {
  try {
    const lessonId = parseInt(req.params.id);
    const { availableSeats } = req.body;

    if (availableSeats === undefined) {
      return res.status(400).json({ error: 'availableSeats required' });
    }

    const result = await db.collection('lessons').updateOne(
      { id: lessonId },
      { $set: { availableSeats: availableSeats } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    console.log(`✅ Updated lesson ${lessonId} to ${availableSeats} seats`);
    res.json({
      message: 'Lesson updated successfully',
      lessonId: lessonId,
      newAvailableSeats: availableSeats
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

// SEARCH

// GET /search
app.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.q;

    if (!searchQuery) {
      return res.status(400).json({ error: 'Search query "q" required' });
    }

    console.log(`🔍 Searching for: "${searchQuery}"`);

    const regex = new RegExp(searchQuery, 'i');
    
    const searchCriteria = {
      $or: [
        { title: regex },
        { location: regex },
        { description: regex }
      ]
    };

    // Add numeric search if query is a number
    if (!isNaN(searchQuery)) {
      searchCriteria.$or.push(
        { price: parseFloat(searchQuery) },
        { availableSeats: parseInt(searchQuery) }
      );
    }

    const lessons = await db.collection('lessons').find(searchCriteria).toArray();
    console.log(`✅ Found ${lessons.length} results`);

    res.json({
      query: searchQuery,
      count: lessons.length,
      results: lessons
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to search lessons' });
  }
});

// START SERVER

app.listen(PORT, () => {
  console.log('🚀 Server started');
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 URL: https://cst3144-coursework1-backend-yamin.onrender.com`);
});
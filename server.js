const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MONGODB CONNECTION SETUP
const MONGODB_URI = process.env.MONGODB_URI;
let db;
let mongoClient;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    mongoClient = await MongoClient.connect(MONGODB_URI);
    db = mongoClient.db('school');
    console.log('Connected to MongoDB successfully!');
    
    // Check if database needs seeding
    const lessonsCount = await db.collection('lessons').countDocuments();
    if (lessonsCount === 0) {
      console.log('Database is empty. Seeding data...');
      await seedDatabase();
    } else {
      console.log(`Found ${lessonsCount} lessons in database`);
    }
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}

// DATABASE SEEDING DATA
const lessonsData = [
  {
    id: 2001,
    title: 'Advanced Mathematics',
    description: 'A challenge-based class covering algebra, calculus fundamentals, and problem solving.',
    price: 45.00,
    image: 'https://wpstaq-ap-southeast-2-media.s3.amazonaws.com/the-thinking-cap/wp-content/uploads/media/2021/01/Should-I-do-Standard-Maths-or-Advanced-Maths_-1.jpg',
    availableSeats: 5,
    location: 'Dubai Marina',
    rating: 4
  },
  {
    id: 2002,
    title: 'Creative Writing',
    description: 'Develop storytelling skills through prompts, workshops, and peer review.',
    price: 30.00,
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80',
    availableSeats: 5,
    location: 'Jumeirah',
    rating: 5
  },
  {
    id: 2003,
    title: 'Robotics Club',
    description: 'Hands-on robotics with weekly builds and team challenges.',
    price: 55.00,
    image: 'https://anandice.ac.in/wp-content/uploads/2025/01/mechanical-and-electrical-engineers-collaborate-in-robotics.png',
    availableSeats: 5,
    location: 'Business Bay',
    rating: 5
  },
  {
    id: 2004,
    title: 'Art & Design',
    description: 'Explore drawing, painting, and digital art techniques.',
    price: 25.00,
    image: 'https://miro.medium.com/v2/resize:fit:1400/1*wj-ZuazaL-hq_6keyoVbGA.jpeg',
    availableSeats: 5,
    location: 'Al Barsha',
    rating: 3
  },
  {
    id: 2005,
    title: 'Science Lab',
    description: 'Exciting experiments in chemistry, physics, and biology.',
    price: 50.00,
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    availableSeats: 5,
    location: 'Dubai Marina',
    rating: 4
  },
  {
    id: 2006,
    title: 'Music Theory',
    description: 'Learn to read music, understand harmony, and compose melodies.',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
    availableSeats: 5,
    location: 'Downtown Dubai',
    rating: 4
  },
  {
    id: 2007,
    title: 'Web Development',
    description: 'Build websites using HTML, CSS, and JavaScript from scratch.',
    price: 60.00,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    availableSeats: 5,
    location: 'Dubai Silicon Oasis',
    rating: 5
  },
  {
    id: 2008,
    title: 'Photography Basics',
    description: 'Master camera settings, composition, and photo editing techniques.',
    price: 40.00,
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80',
    availableSeats: 5,
    location: 'Jumeirah',
    rating: 4
  },
  {
    id: 2009,
    title: 'Drama & Theatre',
    description: 'Acting techniques, script reading, and stage performance skills.',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=800&q=80',
    availableSeats: 5,
    location: 'Al Barsha',
    rating: 5
  },
  {
    id: 2010,
    title: 'Sports & Fitness',
    description: 'Team sports, fitness training, and healthy lifestyle habits.',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    availableSeats: 5,
    location: 'Dubai Marina',
    rating: 4
  },
  {
    id: 2011,
    title: 'Cooking & Nutrition',
    description: 'Learn healthy recipes, cooking techniques, and nutrition basics.',
    price: 38.00,
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
    availableSeats: 5,
    location: 'Business Bay',
    rating: 3
  },
  {
    id: 2012,
    title: 'Chess Strategy',
    description: 'Develop critical thinking through chess tactics and tournaments.',
    price: 20.00,
    image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80',
    availableSeats: 5,
    location: 'Downtown Dubai',
    rating: 4
  }
];

// DATABASE SEEDING FUNCTION
async function seedDatabase() {
  try {
    // Clear existing lessons
    await db.collection('lessons').deleteMany({});
    console.log('Cleared old lessons');

    // Insert new lessons
    const result = await db.collection('lessons').insertMany(lessonsData);
    console.log(`Inserted ${result.insertedCount} lessons`);

    // Create search index for text search
    try {
      await db.collection('lessons').createIndex({ 
        title: 'text', 
        location: 'text', 
        description: 'text' 
      });
      console.log('Search index created');
    } catch (indexError) {
      console.log('Search index already exists or error:', indexError.message);
    }

    console.log('DATABASE SEEDED SUCCESSFULLY!\n');
  } catch (error) {
    console.error('Error seeding database:', error.message);
    throw error;
  }
}

// MIDDLEWARE SETUP
// JSON BODY PARSER
app.use(express.json());

// LOGGER MIDDLEWARE
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log('\n' + '='.repeat(60));
  console.log(`[${timestamp}]`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`IP: ${req.ip}`);
  
  if (req.query && Object.keys(req.query).length > 0) {
    console.log(`Query Params:`, req.query);
  }
  
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`Body:`, req.body);
  }
  
  console.log('='.repeat(60));
  next();
});

// CORS MIDDLEWARE
app.use(cors({
  origin: [
    'https://yfyuky.github.io',
    'https://cst3144-coursework1-backend-yamin.onrender.com',
    'http://127.0.0.1:5500',
    'http://localhost:5500'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// STATIC FILE MIDDLEWARE FOR IMAGES
app.use('/images', (req, res) => {
  const imagePath = path.join(__dirname, 'public', 'images', req.path);
  
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(`Image not found: ${req.path}`);
      return res.status(404).json({ 
        error: 'Image not found',
        path: req.path,
        message: `The requested image "${req.path}" does not exist on the server.`
      });
    }
    console.log(`Serving image: ${req.path}`);
    res.sendFile(imagePath);
  });
});

// API ROUTES
// ROOT ROUTE - API Information
app.get('/', (req, res) => {
  res.json({
    message: 'CST3144 Full Stack Development - Backend API',
    student: 'Your Name',
    studentId: 'M00913254',
    version: '1.0.0',
    endpoints: {
      'GET /': 'API information (this page)',
      'GET /lessons': 'Get all lessons',
      'POST /orders': 'Create a new order',
      'PUT /lessons/:id': 'Update lesson available spaces',
      'GET /search?q=query': 'Search lessons by title, location, or description'
    },
    documentation: 'Test all routes using Postman or your frontend application'
  });
});


// GET /lessons
app.get('/lessons', async (req, res) => {
  try {
    const lessons = await db.collection('lessons').find({}).toArray();
    console.log(`✅ Returned ${lessons.length} lessons`);
    res.json(lessons);
  } catch (error) {
    console.error('❌ Error fetching lessons:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch lessons',
      details: error.message 
    });
  }
});

// POST /orders
app.post('/orders', async (req, res) => {
  try {
    // Validate required fields
    const { name, phone, lessonIDs, numberOfSpaces } = req.body;
    
    if (!name || !phone || !lessonIDs || !numberOfSpaces) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'phone', 'lessonIDs', 'numberOfSpaces']
      });
    }

    // Create order object
    const order = {
      name: name,
      phone: phone,
      lessonIDs: lessonIDs,
      numberOfSpaces: numberOfSpaces,
      createdAt: new Date(),
      status: 'confirmed'
    };

    // Insert into database
    const result = await db.collection('orders').insertOne(order);
    
    console.log(`Order created successfully!`);
    console.log(`Order ID: ${result.insertedId}`);
    console.log(`Customer: ${name}`);
    console.log(`Phone: ${phone}`);
    console.log(`Lessons: ${lessonIDs.length} lesson(s)`);
    
    res.status(201).json({
      message: 'Order created successfully',
      orderId: result.insertedId,
      order: order
    });
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ 
      error: 'Failed to create order',
      details: error.message 
    });
  }
});

// PUT /lessons/:id
app.put('/lessons/:id', async (req, res) => {
  try {
    const lessonId = parseInt(req.params.id);
    const { availableSeats } = req.body;

    // Validate input
    if (availableSeats === undefined) {
      return res.status(400).json({ 
        error: 'availableSeats is required in request body'
      });
    }

    if (typeof availableSeats !== 'number' || availableSeats < 0) {
      return res.status(400).json({ 
        error: 'availableSeats must be a non-negative number'
      });
    }

    // Update the lesson
    const result = await db.collection('lessons').updateOne(
      { id: lessonId },
      { $set: { availableSeats: availableSeats } }
    );

    if (result.matchedCount === 0) {
      console.log(`Lesson ${lessonId} not found`);
      return res.status(404).json({ 
        error: 'Lesson not found',
        lessonId: lessonId 
      });
    }

    console.log(`Lesson ${lessonId} updated to ${availableSeats} available seats`);
    
    res.json({
      message: 'Lesson updated successfully',
      lessonId: lessonId,
      newAvailableSeats: availableSeats,
      modified: result.modifiedCount
    });
  } catch (error) {
    console.error('Error updating lesson:', error.message);
    res.status(500).json({ 
      error: 'Failed to update lesson',
      details: error.message 
    });
  }
});

// GET /search
app.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.q;

    // Validate search query
    if (!searchQuery) {
      return res.status(400).json({ 
        error: 'Search query "q" is required',
        example: '/search?q=math'
      });
    }

    console.log(`Searching for: "${searchQuery}"`);

    // Create case-insensitive regex for search
    const regex = new RegExp(searchQuery, 'i');
    
    // Search criteria - searches in title, location, and description
    const searchCriteria = {
      $or: [
        { title: regex },
        { location: regex },
        { description: regex }
      ]
    };

    // Add numeric search if query is a number
    if (!isNaN(searchQuery)) {
      const numericValue = parseFloat(searchQuery);
      searchCriteria.$or.push(
        { price: numericValue },
        { availableSeats: parseInt(searchQuery) },
        { rating: parseInt(searchQuery) }
      );
    }

    // Execute search
    const lessons = await db.collection('lessons').find(searchCriteria).toArray();
    
    console.log(`Found ${lessons.length} matching lesson(s)`);

    res.json({
      query: searchQuery,
      count: lessons.length,
      results: lessons
    });
  } catch (error) {
    console.error('Error searching lessons:', error.message);
    res.status(500).json({ 
      error: 'Failed to search lessons',
      details: error.message 
    });
  }
});

// ADDITIONAL UTILITY ROUTES
// GET /orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await db.collection('orders').find({}).toArray();
    console.log(`Returned ${orders.length} orders`);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      details: error.message 
    });
  }
});

// POST /reset
app.post('/reset', async (req, res) => {
  try {
    console.log('Resetting database...');
    await seedDatabase();
    res.json({ 
      message: 'Database reset successfully',
      lessons: lessonsData.length 
    });
  } catch (error) {
    console.error('Error resetting database:', error.message);
    res.status(500).json({ 
      error: 'Failed to reset database',
      details: error.message 
    });
  }
});

// ERROR HANDLING
// 404 Handler - Route not found
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.url,
    method: req.method,
    message: 'The requested endpoint does not exist',
    availableRoutes: [
      'GET /',
      'GET /lessons',
      'POST /orders',
      'PUT /lessons/:id',
      'GET /search?q=query'
    ]
  });
});

// Global Error Handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// SERVER STARTUP
async function startServer() {
  try {
    // Connect to database first
    await connectToDatabase();
    
    // Then start the server
    app.listen(PORT, () => {
      console.log('CST3144 BACKEND SERVER STARTED SUCCESSFULLY!');
      console.log(`Local: http://localhost:${PORT}`);
      console.log(`Production: https://cst3144-coursework1-backend-yamin.onrender.com`);
      console.log('\n Available Endpoints:');
      console.log('GET  /              - API information');
      console.log('GET  /lessons       - Get all lessons');
      console.log('POST /orders        - Create new order');
      console.log('PUT  /lessons/:id   - Update lesson spaces');
      console.log('GET  /search?q=...  - Search lessons');
      console.log('GET  /orders        - Get all orders (testing)');
      console.log('POST /reset         - Reset database (testing)');
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n Shutting down server...');
  if (mongoClient) {
    await mongoClient.close();
    console.log(' MongoDB connection closed');
  }
  process.exit(0);
});

// Start the server
startServer();
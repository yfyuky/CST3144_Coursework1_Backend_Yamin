// Seed Database Script
const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

// Lessons Data
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

async function seedDatabase() {
    let client;

    try {
        console.log('🔌 Connecting to MongoDB...');
        client = await MongoClient.connect(MONGODB_URI);
        console.log('✅ Connected!');

        const db = client.db('school');

        // Clear existing lessons
        await db.collection('lessons').deleteMany({});
        console.log('🗑️ Cleared old lessons');

        // Insert new lessons
        const result = await db.collection('lessons').insertMany(lessonsData);
        console.log(`✅ Inserted ${result.insertedCount} lessons`);

        // Create search index
        await db.collection('lessons').createIndex({ 
            title: 'text', 
            location: 'text', 
            description: 'text' 
        });
        console.log('✅ Search index created');

        console.log('\n✅ DATABASE SEEDED SUCCESSFULLY!');
        console.log('🚀 Run: npm start');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (client) {
            await client.close();
        }
    }
}

seedDatabase();
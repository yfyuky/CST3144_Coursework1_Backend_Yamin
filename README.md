# My Backend for CST3144 Coursework

**Name:** Yamin Rizwan
**ID:** M00913254  
**Module:** CST3144 Full Stack Development

---

## What is this?

This is the backend part of my after-school lessons booking app. It's basically a server that stores all the lesson data and handles when people book lessons.

---

## What I used

- Node.js - to run JavaScript on the server
- Express - to make the API routes easier
- MongoDB - to store the lessons and orders
- Render.com - to put it online

---

## How to run it

1. Download the files
2. Open terminal in the folder
3. Type: `npm install`
4. Type: `npm start`
5. Go to `http://localhost:3000` in your browser

If you see some JSON text, it's working!

---

## The API routes I made

### Get lessons
```
http://localhost:3000/lessons
```
This shows all the lessons from the database.

### Make an order
```
POST http://localhost:3000/orders
```
This saves someone's booking to the database. You need to send the name, phone, and which lessons they want.

### Update spaces
```
PUT http://localhost:3000/lessons/2001
```
This changes how many spaces are left for a lesson. I use this after someone books.

### Search
```
http://localhost:3000/search?q=math
```
This lets you search for lessons. It checks the title, location, and description.

---

## My database

I'm using MongoDB Atlas (the free cloud one). It has two collections:

**lessons** - stores all 12 lessons with their info  
**orders** - stores bookings when people checkout

The database automatically gets filled with 12 lessons when you first start the server.

---

## What's deployed where

My backend is online at:
```
https://cst3144-coursework1-backend-yamin.onrender.com
```

My frontend connects to this URL to get the data.

---

## What I had to do for the coursework

-  Make a logger that prints out every request
-  Make a thing that serves images (or shows error if image not found)
-  GET route to get all lessons
-  POST route to save orders
-  PUT route to update available spaces
-  Search route that works on the backend (the hard one!)

---

## Problems I had

**Problem 1:** CORS errors  
The frontend couldn't talk to the backend at first. I fixed it by adding the CORS package and putting in my GitHub Pages URL.

**Problem 2:** The search was crashing  
There was a bug with the logger middleware. It was trying to check req.body before it existed. I moved express.json() before the logger and it worked.

**Problem 3:** Deploying to Render  
I forgot to add the MongoDB connection as an environment variable. Once I added it in Render's settings, it worked.

---

## What I learned

- How to make an API with Express
- How to connect to MongoDB
- What middleware is and how it works
- How to deploy stuff to the cloud
- How to fix CORS errors (finally!)
- Using Postman to test APIs

---

## Files in this project

- `server.js` - the main file with everything
- `package.json` - lists all the packages I need
- `.env` - my MongoDB password (not on GitHub!)

---

## Testing

I tested everything with:
- Postman - to test each route individually
- My browser - for the GET routes
- My frontend - to make sure they work together

---

## Notes

- The server runs on port 3000
- All 12 lessons start with 5 spaces each
- The database seeds itself automatically so you don't have to do anything extra

---

That's it!

**Last updated:** December 2025
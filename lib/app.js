/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
// import client from './client.js';
import ensureAuth from './auth/ensure-auth.js';
import createAuthRoutes from './auth/create-auth-routes.js';
import request from 'superagent'; 

// make an express app
const app = express();

// allow our server to be called from any website
app.use(cors());
// read JSON from body of request when indicated by Content-Type
app.use(express.json());
// enhanced logging
app.use(morgan('dev'));

const authRoutes = createAuthRoutes();

const apiKey = process.env.YOUTUBE_API_KEY;

// setup authentication routes to give user an auth token
// creates a /api/auth/signin and a /api/auth/signup POST route. 
// each requires a POST body with a .email and a .password and .name
app.use('/api/auth', authRoutes);

// heartbeat route
app.get('/', (req, res) => {
  res.send('Mixtape API');
});

// everything that starts with "/api" below here requires an auth token!
// In theory, you could move "public" routes above this line
app.use('/api', ensureAuth);

// API routes:

// here we get the playlist title using the playlists endpoint 

app.get('/api/playlist/:id', async (req, res) => {
  // use SQL query to get data...
  try {
    const response = await request.get(`https://www.googleapis.com/youtube/v3/playlists?key=${apiKey}&part=snippet&id=${req.params.id}&maxResults=50
    `);

    // send back the data
    res.json(response.body.items[0].snippet || null); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

// here we get the playlist items (song titles, thumbnail images, etc.) using the playlistItems endpoint!

app.get('/api/playlistItems/:id', async (req, res) => {
  // use SQL query to get data...
  try {
    const response = await request.get(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${req.params.id}&key=${apiKey}&maxResults=50`)
  ;
    console.log(response.body.items);

    // send back the data
    res.json(response.body.items || null); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

// put playlist info into database (playlist table), associate with user (join)

// delete playlist from playlist table

// add playlist to favorites table (join with user)

// delete playlist from favorites table

// add note to playlist table

// delete note from playlist table

export default app;
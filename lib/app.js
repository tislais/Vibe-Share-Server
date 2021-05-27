/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';
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

    // send back the data
    res.json(response.body.items || null); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

// post playlist info into database (playlist table), associate with user (join)

app.post('/api/mixtape', async (req, res) => {
  try {
    const mixtape = req.body;
    const data = await client.query(`
      INSERT INTO playlists (playlist_id, title, theme, note, recipient, user_id)
      VALUES      ($1, $2, $3, $4, $5, $6)
      RETURNING   id, playlist_id, title, theme, note, recipient, user_id as "userId";
    `, [mixtape.playlist_id, mixtape.title, mixtape.theme, mixtape.note, mixtape.recipient, req.userId]);
    console.log(data.rows);
    // if you want to return all from playlist table, use data.rows
    res.json(data.rows[0]);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });      
  }
});

// get mixtape by id

app.get('/api/mixtape/:id', async (req, res) => {
  try {
    const data = await client.query(`
      SELECT id, playlist_id, title, theme, note, recipient, user_id as "userId"
      FROM      playlists
      WHERE   id = $1;
    `, [req.params.id]);

    res.json(data.rows);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });      
  }
});

// get list of all of one user's mixtapes by user id

app.get('/api/mixtape/:userId', async (req, res) => {
  try {
    const data = await client.query(`
      SELECT id, playlist_id, title, theme, note, recipient, user_id as "userId"
      FROM      playlists
      WHERE   userId = $1;
    `, [req.userId]);

    res.json(data.rows);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });      
  }
});

// delete playlist from playlist table

app.delete('/api/mixtape/:id', async (req, res) => {
  try {
    const data = await client.query(`
      DELETE FROM  playlists
      WHERE        id = $1
      AND          user_id = $2
      RETURNING    id, playlist_id, title, theme, note, recipient, user_id;  
    `, [req.params.id, req.userId]);

    res.json(data.rows[0]); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

// get all user's favorites

app.get('/api/mixtape/:id/favorites', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
      SELECT  f.id, favorites_playlist_id, favorites_user_id
      FROM    favorites f
      JOIN    users u
      ON      f.favorites_user_id = u.id
      WHERE   favorites_user_id = $1
    `, [req.params.id]);

    // send back the data
    res.json(data.rows[0] || null); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

// add playlist to favorites table (join with user)

app.post('/api/favorites', async (req, res) => {
  try {
    const favorite = req.body;

    const data = await client.query(`
      INSERT INTO favorites (favorites_playlist_id, favorites_user_id)
      VALUES      ($1, $2)
      RETURNING   *;
    `, [favorite.favorites_playlist_id, req.userId]);

    res.json(data.rows[0]);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });      
  }
});

// delete playlist from favorites table

app.delete('/api/favorites/:id', async (req, res) => {
  try {
    const data = await client.query(`
      DELETE FROM  favorites 
      WHERE        id = $1
      AND          favorites_user_id = $2
      RETURNING    *;   
    `, [req.params.id, req.userId]);
    console.log(data.rows[0]);
    res.json(data.rows[0]); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});
 
export default app;
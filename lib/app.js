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


// heartbeat route
app.get('/', (req, res) => {
  res.send('Mixtape API');
});

/* AUTH ROUTES */

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /api/auth/signin and a /api/auth/signup POST route. 
// each requires a POST body with a .email and a .password and .name
app.use('/api/auth', authRoutes);

/* YOUTUBE PROXY ROUTES */

const apiKey = process.env.YOUTUBE_API_KEY;

app.get('/api/playlists/:id', async (req, res) => {
  try {
    const response = await request.get(`https://www.googleapis.com/youtube/v3/playlists?key=${apiKey}&part=snippet&id=${req.params.id}&maxResults=50`);

    res.json(response.body.items[0].snippet || null); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

app.get('/api/playlistItems/:id', async (req, res) => {
  try {
    const response = await request.get(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${req.params.id}&key=${apiKey}&maxResults=50`);

    res.json(response.body.items || null); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

/* PUBLIC MIXTAPES ROUTES */

app.get('/api/mixtapes', async (req, res) => {
  try {
    const data = await client.query(`
      SELECT id, playlist_id, title, theme, note, recipient, user_id as "userId"
      FROM playlists
    `, []);
    // [req.userId]
    console.log(data.rows);
    res.json(data.rows || null);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message }); 
  }
});

app.get('/api/mixtapes/:id', async (req, res) => {
  
  try {
    const data = await client.query(`
      SELECT id, playlist_id, title, theme, note, recipient, user_id as "userId"
      FROM      playlists
      WHERE   id = $1;
    `, [req.params.id]);

    // just one!
    res.json(data.rows[0]);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });      
  }
});

/* PROTECTED ROUTES */

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

/* MIXTAPES PROTECTED ROUTES */

app.post('/api/mixtapes', async (req, res) => {
  try {
    const mixtape = req.body;
    const data = await client.query(`
      INSERT INTO playlists (playlist_id, title, theme, note, recipient, user_id)
      VALUES      ($1, $2, $3, $4, $5, $6)
      RETURNING   id, playlist_id, title, theme, note, recipient, user_id as "userId";
    `, [mixtape.playlist_id, mixtape.title, mixtape.theme, mixtape.note, mixtape.recipient, req.userId]);

    res.json(data.rows[0]);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });      
  }
});

// get list of all of one user's mixtapes by user id

app.get('/api/me/mixtapes', async (req, res) => {
  try {
    const data = await client.query(`
      SELECT id, playlist_id, title, theme, note, recipient, user_id as "userId"
      FROM      playlists
      WHERE   user_id = $1;
    `, [req.userId]);

    res.json(data.rows);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });      
  }
});

// get list of all mixtape by user id
app.get('/api/users/:id/mixtapes', async (req, res) => {
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

app.delete('/api/mixtapes/:id', async (req, res) => {
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

/* FAVORITES PROTECTED ROUTES */

app.get('/api/me/favorites', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
      SELECT  f.id, favorites_playlist_id, favorites_user_id
      FROM    favorites f
      JOIN    users u
      ON      f.favorites_user_id = u.id
      WHERE   favorites_user_id = $1
    `, [req.userId]);

    // send back the data
    res.json(data.rows[0] || null); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

// add playlist to favorites table

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
    res.json(data.rows[0]); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});
 
export default app;
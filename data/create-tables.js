/* eslint-disable no-console */
import client from '../lib/client.js';

// async/await needs to run in a function
run();

async function run() {

  try {

    // run a query to create tables
    await client.query(` 
      CREATE TABLE users (
        id SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(512) NOT NULL,
        email VARCHAR(512) NOT NULL,
        hash VARCHAR(512) NOT NULL
      );
    
      CREATE TABLE playlists (
        id SERIAL PRIMARY KEY NOT NULL,
        playlist_id VARCHAR(512) NOT NULL,
        title VARCHAR(512) NOT NULL,
        theme VARCHAR(512) NOT NULL,
        note TEXT NOT NULL,
        recipient TEXT,
        user_id INTEGER NOT NULL REFERENCES users(id)
      );

      CREATE TABLE favorites (
        id SERIAL PRIMARY KEY NOT NULL,
        favorites_playlist_id INTEGER NOT NULL REFERENCES playlists(id),
        favorites_user_id INTEGER NOT NULL REFERENCES users(id)
      );
    `);

    console.log('create tables complete');
  }
  catch (err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}
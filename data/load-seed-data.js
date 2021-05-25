/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import users from './users.js';
import playlists from './playlists.js';

run();

async function run() {

  try {

    const data = await Promise.all(
      users.map(user => {
        return client.query(`
          INSERT INTO users (name, email, hash)
          VALUES ($1, $2, $3)
          RETURNING *;
        `,
        [user.name, user.email, user.password]);
      })
    );
    
    const user = data[0].rows[0];

    await Promise.all(
      playlists.map(playlist => {
        return client.query(`
        INSERT INTO playlists (playlist_id, title, theme, note, user_id)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [playlist.playlist_id, playlist.title, playlist.theme, playlist.note, user.id]);
      })
    );
    

    console.log('seed data load complete');
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
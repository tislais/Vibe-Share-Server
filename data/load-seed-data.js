/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import users from './users.js';
import playlists from './playlists.js';
// import favorites from './favorites.js';

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
    

    const playlistData = await Promise.all(
      playlists.map(playlist => {
        return client.query(`
        INSERT INTO playlists (playlist_id, title, theme, note, recipient, user_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
        `,
        [playlist.playlist_id, playlist.title, playlist.theme, playlist.note, playlist.recipient, user.id]);
      })
    );

    const favoritesData = playlistData[0].rows;

    
    await Promise.all(
      favoritesData.map((playlist) => {
        return client.query(`
        INSERT INTO favorites (favorites_playlist_id, favorites_user_id)
        VALUES ($1, $2)
        `,
        [playlist.id, user.id]);
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
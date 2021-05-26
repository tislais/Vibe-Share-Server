import client from '../lib/client.js';
import supertest from 'supertest';
import app from '../lib/app.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  afterAll(async () => {
    return client.end();
  });

  describe('/api/playlists', () => {
    let user;

    beforeAll(async () => {
      execSync('npm run recreate-tables');

      const response = await request
        .post('/api/auth/signup')
        .send({
          name: 'Moi le User',
          email: 'moi@user.com',
          password: 'passmot'
        });

      expect(response.status).toBe(200);

      user = response.body;
    });

    let mixtape = {
      // id expect anything??
      'id': 1,
      'playlist_id': '9876',
      'title': 'Bangin Test Vibes',
      'theme': 'test wave',
      'note': 'Once upon a test time',
      'recipient': 'haxx0r',
      'userId': 1
    };

    let favorite = {
      'id': 1,
      'favorites_playlist_id': 1,
      'favorites_user_id': 1
    };

    // append the token to your requests:
    //  .set('Authorization', user.token);
    
    it('POST mixtape to /api/mixtape', async () => {
      
      const response = await request
        .post('/api/mixtape')
        .set('Authorization', user.token)
        .send(mixtape);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ 
        userId: user.id,
        ...mixtape
      });
    
      // Update local client favorite object
      mixtape = response.body;
    });

    it('GET mixtape from /api/mixtape/:id', async () => {
      const response = await request.get(`/api/mixtape/${mixtape.id}`)
        .set('Authorization', user.token);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: mixtape.id, userId: user.id, ...mixtape }]);
    });

    // add a playlist to favorites
    it('POST favorite to /api/favorites', async () => {
      
      const response = await request
        .post('/api/favorites')
        .set('Authorization', user.token)
        .send(favorite);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ 
        favorites_user_id: user.id,
        ...favorite
      });
      
      // Update local client favorite object
      favorite = response.body;
    });

    // get all of user's favorites
    it('GET my /api/mixtape/:id/favorites only returns my favorites', async () => {
      // this is setup so that there is a favorite belong to someone else in the db
      const otherResponse = await request
        .post('/api/favorites')
        .set('Authorization', user.token)
        .send({
          favorites_playlist_id: 1,
          favorites_user_id: user.id
        });

      expect(otherResponse.status).toBe(200);
      const otherFavorite = otherResponse.body;

      // we are testing this
      const response = await request.get(`/api/mixtape/${user.id}/favorites`)
        .set('Authorization', user.token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ...otherFavorite, id: 1 });

    });

    // delete playlist from favorites table

    it('DELETE favorite to /api/favorites/:id', async () => {
      
      const response = await request
        .delete(`/api/favorites/${favorite.id}`)
        .set('Authorization', user.token)
        .send(favorite);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(favorite);
      
    });

    it('GET mixtape from /api/mixtape/:userId', async () => {
      const response = await request.get(`/api/mixtape/${user.id}`)
        .set('Authorization', user.token);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: mixtape.id, userId: user.id, ...mixtape }]);
    });

  });
});
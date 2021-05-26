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
      'id': expect.anything(),
      'playlist_id': '9876',
      'title': 'Bangin Test Vibes',
      'theme': 'test wave',
      'note': 'Once upon a test time',
      'recipient': 'haxx0r',
      'userId': 1
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

    it.skip('GET mixtape from /api/mixtape/:id', async () => {
      const response = await request.get(`/api/mixtape/${mixtape.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ...mixtape, userId: user.id });
    });

  });
});
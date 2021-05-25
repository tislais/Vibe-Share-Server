import { extractTitle } from '../lib/munge-utils';

describe('API Playlist Title Munging', () => {

  const dataFromPlaylist = {
    'publishedAt': '2021-05-24T21:26:07Z',
    'channelId': 'UCfQJsU99aMt11GQt5KdRCYA',
    'title': 'Breakup Songs',
    'description': '',
    'thumbnails': {
      'default': {
        'url': 'https://i.ytimg.com/vi/8NnQs3EtoqU/default.jpg',
        'width': 120,
        'height': 90
      },
      'medium': {
        'url': 'https://i.ytimg.com/vi/8NnQs3EtoqU/mqdefault.jpg',
        'width': 320,
        'height': 180
      },
      'high': {
        'url': 'https://i.ytimg.com/vi/8NnQs3EtoqU/hqdefault.jpg',
        'width': 480,
        'height': 360
      },
      'standard': {
        'url': 'https://i.ytimg.com/vi/8NnQs3EtoqU/sddefault.jpg',
        'width': 640,
        'height': 480
      },
      'maxres': {
        'url': 'https://i.ytimg.com/vi/8NnQs3EtoqU/maxresdefault.jpg',
        'width': 1280,
        'height': 720
      }
    },
    'channelTitle': 'Vibe Share',
    'localized': {
      'title': 'Breakup Songs',
      'description': ''
    }
  };

  const expectedPlaylistTitle = 
    {
      title: 'Breakup Songs',
    }
  ;

  it('munges movie data', async () => {
    // arrange
    // expected is in variable above
    // movieData is imported from file

    // act 
    const output = extractTitle(dataFromPlaylist);

    // assert
    expect(output).toEqual(expectedPlaylistTitle);
  });
});

import { extractTitle, extractPlaylistItems } from '../lib/munge-utils';

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

  const dataFromPlaylistItems = [
    {
      'kind': 'youtube#playlistItem',
      'etag': 'GM0s9U42JhaxmVzJiVZr-m0K9rg',
      'id': 'UExjX0prcUpBWkJNek1ENkNKZktNdHctU2F6VUx4NUlLdy41NkI0NEY2RDEwNTU3Q0M2',
      'snippet': {
        'publishedAt': '2021-05-24T21:26:07Z',
        'channelId': 'UCfQJsU99aMt11GQt5KdRCYA',
        'title': 'Neck Deep - December',
        'description': '"December" off of the new full-length Life\'s Not Out To Get You out now! \n\n►Buy Neck Deep merch at: http://hopelessrecords.com/lifesnotouttogetyou  \n►Buy Life\'s Not Out To Get You on iTunes: http://smarturl.it/LifesNotOutToGetYou\n---\nLyrics: \nStumbled round the block a thousand times, \nMissed every call that I had tried, so now I\'m giving up.\nA heartbreak in mid December,\nYou don\'t give a fuck,\nYou\'d never remember me while you\'re pulling on his jeans,\nGetting lost in the big city.\nI was looking out our window.\nWatching all the cars go,\nWondering if I\'ll see Chicago,\nOr a sunset on the west coast.\nOr will I die in the cold?\nFeeling blue and alone.\nI wonder if you\'ll ever hear this song on your stereo.\nI hope you get your ballroom floor,\nYour perfect house with rose red doors.\nI\'m the last thing you\'d remember, \nIt\'s been a long, lonely December.\nI wish I\'d known that less is more,\nBut I was passed out on the floor,\nAnd that\'s the last thing I remember,\nIt\'s been a long, lonely December.\nCast me aside to show yourself in a better light, \nI came out breathing, barely breathing, and you came out alright.\nBut I\'m sure you\'ll take his hand,\nI hope he\'s better than I ever could\'ve been.\nMy mistakes were not intentions,\nThis is a list of my confessions I couldn\'t say.\nPain is never permanent but tonight it\'s killing me.\nI miss your face,\nYou\'re in my head,\nThere\'s so many things that I should\'ve said.\nA year of suffering, a lesson learned.\nI miss you, but I wish you well,\nI miss you, but I wish you well,\nI miss you, yeah I miss you.\n---\nSubscribe for more great videos: http://hopel.es/HRYouTube\nFollow Hopeless Records on Twitter: @HopelessRecords\nFollow Neck Deep on Twitter: @NeckDeepUK\nFollow Neck Deep on Facebook: https://www.facebook.com/neckdeepuk\n\nhttp://www.neckdeepuk.com\nhttp://www.hopelessrecords.com\n\n#NeckDeep #PopPunk #HopelessRecords #LNOTGY',
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
        'playlistId': 'PLc_JkqJAZBMzMD6CJfKMtw-SazULx5IKw',
        'position': 0,
        'resourceId': {
          'kind': 'youtube#video',
          'videoId': '8NnQs3EtoqU'
        },
        'videoOwnerChannelTitle': 'Hopeless Records',
        'videoOwnerChannelId': 'UCToUNe4i9j_SlKGFl8MrQHg'
      }
    },
    {
      'kind': 'youtube#playlistItem',
      'etag': 'R0VD-scYHs95LpGRhJCOT_cWXQE',
      'id': 'UExjX0prcUpBWkJNek1ENkNKZktNdHctU2F6VUx4NUlLdy4yODlGNEE0NkRGMEEzMEQy',
      'snippet': {
        'publishedAt': '2021-05-24T21:26:43Z',
        'channelId': 'UCfQJsU99aMt11GQt5KdRCYA',
        'title': 'Solange - Some Things Never Seem To Fucking Work',
        'description': 'GET THE TRUE EP:\nTerrible Records: http://terriblerecords.bigcartel.com/product/solange-x-opening-ceremony-special-edition-true-cd\niTunes: https://itunes.apple.com/us/album/true/id575984370\n\nSOLANGE ONLINE:\nhttps://twitter.com/solangeknowles\nhttp://instagram.com/saintrecords\nhttps://www.facebook.com/solange\nhttps://play.spotify.com/artist/2auiVi8sUZo17dLy1HwrTU',
        'thumbnails': {
          'default': {
            'url': 'https://i.ytimg.com/vi/GYDeI4rt5Gw/default.jpg',
            'width': 120,
            'height': 90
          },
          'medium': {
            'url': 'https://i.ytimg.com/vi/GYDeI4rt5Gw/mqdefault.jpg',
            'width': 320,
            'height': 180
          },
          'high': {
            'url': 'https://i.ytimg.com/vi/GYDeI4rt5Gw/hqdefault.jpg',
            'width': 480,
            'height': 360
          },
          'standard': {
            'url': 'https://i.ytimg.com/vi/GYDeI4rt5Gw/sddefault.jpg',
            'width': 640,
            'height': 480
          },
          'maxres': {
            'url': 'https://i.ytimg.com/vi/GYDeI4rt5Gw/maxresdefault.jpg',
            'width': 1280,
            'height': 720
          }
        },
        'channelTitle': 'Vibe Share',
        'playlistId': 'PLc_JkqJAZBMzMD6CJfKMtw-SazULx5IKw',
        'position': 1,
        'resourceId': {
          'kind': 'youtube#video',
          'videoId': 'GYDeI4rt5Gw'
        },
        'videoOwnerChannelTitle': 'TERRIBLE RECORDS',
        'videoOwnerChannelId': 'UCiaa3QlTR0cg4IhllfzVxdA'
      }
    }
  ];

  const expectedPlaylistItems = [
    {
      title: 'Neck Deep - December',
      videoId: '8NnQs3EtoqU',
      videoOwnerChannelTitle: 'Hopeless Records',
      videoOwnerChannelId: 'UCToUNe4i9j_SlKGFl8MrQHg',
      thumbnail: 'https://i.ytimg.com/vi/8NnQs3EtoqU/sddefault.jpg'
    },
    {
      title: 'Solange - Some Things Never Seem To Fucking Work',
      videoId: 'GYDeI4rt5Gw',
      videoOwnerChannelTitle: 'TERRIBLE RECORDS',
      videoOwnerChannelId: 'UCiaa3QlTR0cg4IhllfzVxdA',
      thumbnail: 'https://i.ytimg.com/vi/GYDeI4rt5Gw/sddefault.jpg'
    }
  ];

  it.skip('It should munge the playlists endpoint and return a playlist title', async () => {
    // arrange
    // expected is in variable above
    // movieData is imported from file

    // act 
    const output = extractTitle(dataFromPlaylist);

    // assert
    expect(output).toEqual(expectedPlaylistTitle);
  });

  it.skip('It should munge the playlistItems endpoint and return item title and id, channel title and id, and standard thumbnail', async () => {
    // arrange
    // expected is in variable above
    // movieData is imported from file

    // act 
    const output = extractPlaylistItems(dataFromPlaylistItems);

    // assert
    expect(output).toEqual(expectedPlaylistItems);
  });
});

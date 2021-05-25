export function extractTitle(data) {
  return {
    title: data.title,
  };
}

export function extractPlaylistItems(data) {
  return data.map(item => {
    return {
      title: item.snippet.title,
      videoId: item.snippet.resourceId.videoId,
      videoOwnerChannelTitle: item.snippet.videoOwnerChannelTitle,
      videoOwnerChannelId: item.snippet.videoOwnerChannelId,
      thumbnail: item.snippet.thumbnails.standard.url
    };
  });
} 
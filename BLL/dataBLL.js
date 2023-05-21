const axios = require('axios');
// Replace with your Vimeo API access token
require('dotenv').config();



// Replace with your Vimeo API access token

async function getVideoDuration(videoId, accessToken) {
  try {
    const response = await axios.get(`https://api.vimeo.com/videos/${videoId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/vnd.vimeo.*+json'
      }
    });

    return response.data.duration;
  } catch (error) {
    throw new Error(`Failed to retrieve duration for video ${videoId}`);
  }
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return [`${hours}`, `${String(minutes).padStart(2, '0')}`, `${String(remainingSeconds).padStart(2, '0')}`]
}

async function calculateTotalVideoLength(folderId, accessToken) {
    console.log(accessToken)
  try {
    const response = await axios.get(`https://api.vimeo.com/me/folders/${folderId}/videos`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/vnd.vimeo.*+json'
      },
      params: {
        per_page: 100 // Adjust this value based on the number of videos in your folder
      }
    });

    let totalLength = 0;
    const videos = response.data.data;

    for (const video of videos) {
      const duration = await getVideoDuration(video.uri.split('/').pop(), accessToken);
      totalLength += duration;
    }

    console.log(`Total length of videos in Folder ${folderId}: ${formatTime(totalLength)}`);
    const time = formatTime(totalLength)
    return {status: 200, time: time}
  } catch (error) {
    return {status: 400, message: error.message}
}
}



module.exports = {calculateTotalVideoLength}

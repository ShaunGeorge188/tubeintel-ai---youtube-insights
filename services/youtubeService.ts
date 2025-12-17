import { ChannelData, VideoData } from '../types';

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * Helper to validate and format error messages
 */
const handleError = (error: any, context: string) => {
  console.error(`Error in ${context}:`, error);
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
};

/**
 * Fetch Channel Details by ID or Handle
 */
export const fetchChannelDetails = async (input: string, apiKey: string): Promise<ChannelData> => {
  if (!apiKey) throw new Error("YouTube API Key is required");

  let url = `${BASE_URL}/channels?part=snippet,contentDetails,statistics&key=${apiKey}`;
  
  // Determine if input is ID or Handle
  // Handles usually start with @, IDs start with UC
  const isHandle = input.startsWith('@');
  const cleanInput = input.replace(/^(https?:\/\/)?(www\.)?youtube\.com\//, '').replace('/', '');

  if (isHandle) {
    url += `&forHandle=${encodeURIComponent(input)}`;
  } else if (cleanInput.startsWith('UC')) {
    url += `&id=${cleanInput}`;
  } else {
    // Fallback: try as handle if it doesn't look like an ID, otherwise assume it's a username/handle
    url += `&forHandle=${encodeURIComponent('@' + cleanInput)}`;
  }

  const response = await fetch(url);
  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  if (!data.items || data.items.length === 0) {
    throw new Error("Channel not found. Please check the ID or Handle.");
  }

  return data.items[0];
};

/**
 * Fetch Recent Videos from the Uploads Playlist
 */
export const fetchRecentVideos = async (uploadsPlaylistId: string, apiKey: string, maxResults: number = 10): Promise<VideoData[]> => {
  if (!apiKey) throw new Error("YouTube API Key is required");

  // Step 1: Get Playlist Items (Video IDs)
  const playlistUrl = `${BASE_URL}/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${apiKey}`;
  
  const playlistResponse = await fetch(playlistUrl);
  const playlistData = await playlistResponse.json();

  if (playlistData.error) throw new Error(playlistData.error.message);
  if (!playlistData.items || playlistData.items.length === 0) return [];

  const videoIds = playlistData.items.map((item: any) => item.contentDetails.videoId).join(',');

  // Step 2: Get Video Statistics
  const videosUrl = `${BASE_URL}/videos?part=snippet,statistics&id=${videoIds}&key=${apiKey}`;
  const videosResponse = await fetch(videosUrl);
  const videosData = await videosResponse.json();

  if (videosData.error) throw new Error(videosData.error.message);

  return videosData.items || [];
};
// YouTube Data Types
export interface ChannelStatistics {
  viewCount: string;
  subscriberCount: string;
  hiddenSubscriberCount: boolean;
  videoCount: string;
}

export interface ChannelSnippet {
  title: string;
  description: string;
  customUrl: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
  country?: string;
}

export interface ChannelData {
  id: string;
  snippet: ChannelSnippet;
  statistics: ChannelStatistics;
  contentDetails: {
    relatedPlaylists: {
      likes: string;
      uploads: string;
    };
  };
}

export interface VideoStatistics {
  viewCount: string;
  likeCount: string;
  favoriteCount: string;
  commentCount: string;
}

export interface VideoSnippet {
  publishedAt: string;
  title: string;
  description: string;
  thumbnails: {
    medium: { url: string };
  };
}

export interface VideoData {
  id: string;
  snippet: VideoSnippet;
  statistics: VideoStatistics;
}

// AI Report Types
export interface AIReport {
  executiveSummary: string;
  keyInsights: string[];
  improvementSuggestions: string[];
  generatedAt: string;
}

// App State
export interface AppState {
  youtubeApiKey: string;
  channelInput: string;
  channelData: ChannelData | null;
  recentVideos: VideoData[];
  report: AIReport | null;
  loading: boolean;
  error: string | null;
  analyzing: boolean;
}
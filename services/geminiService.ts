import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ChannelData, VideoData, AIReport } from '../types';

// We rely on the globally available process.env.API_KEY for Gemini
// The YouTube API Key is passed separately by the user in the UI
const GEMINI_API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const reportSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    executiveSummary: {
      type: Type.STRING,
      description: "A concise professional summary of the channel's current performance status.",
    },
    keyInsights: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 distinct, data-driven observations about views, engagement, or growth.",
    },
    improvementSuggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2 actionable pieces of advice to improve channel performance.",
    },
  },
  required: ["executiveSummary", "keyInsights", "improvementSuggestions"],
};

export const generateChannelReport = async (
  channel: ChannelData,
  videos: VideoData[]
): Promise<AIReport> => {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API Key is missing in environment variables.");
  }

  // Calculate some aggregate metrics for the prompt
  const totalRecentViews = videos.reduce((acc, v) => acc + parseInt(v.statistics.viewCount || '0'), 0);
  const totalRecentLikes = videos.reduce((acc, v) => acc + parseInt(v.statistics.likeCount || '0'), 0);
  const totalRecentComments = videos.reduce((acc, v) => acc + parseInt(v.statistics.commentCount || '0'), 0);
  
  const avgViews = videos.length ? Math.round(totalRecentViews / videos.length) : 0;
  const engagementRate = totalRecentViews ? ((totalRecentLikes + totalRecentComments) / totalRecentViews * 100).toFixed(2) : '0';

  const promptData = {
    channelName: channel.snippet.title,
    subscribers: channel.statistics.subscriberCount,
    totalChannelViews: channel.statistics.viewCount,
    videoCount: channel.statistics.videoCount,
    recentVideosAnalysis: {
      count: videos.length,
      averageViews: avgViews,
      totalLikes: totalRecentLikes,
      totalComments: totalRecentComments,
      engagementRatePercent: engagementRate
    },
    latestVideoTitle: videos[0]?.snippet.title || "N/A",
    latestVideoViews: videos[0]?.statistics.viewCount || "N/A"
  };

  const prompt = `
    You are a professional Social Media Analyst. 
    Analyze the following YouTube Channel Real-Time Data:
    ${JSON.stringify(promptData, null, 2)}

    Your task is to generate a performance report.
    - Executive Summary: A high-level overview of health and trajectory.
    - Key Insights: Identify trends (e.g., "Views are spiking on recent uploads" or "Engagement is low compared to subscriber count").
    - Suggestions: Concrete actions (e.g., "Focus on Shorts" or "Optimize titles for CTR").

    Keep the tone professional, encouraging, and data-backed. No jargon.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: reportSchema,
        temperature: 0.7, // Slightly creative but grounded
      },
    });

    if (!response.text) {
      throw new Error("No response generated from Gemini.");
    }

    const jsonResponse = JSON.parse(response.text);
    
    return {
      ...jsonResponse,
      generatedAt: new Date().toLocaleTimeString(),
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate AI report. Please try again.");
  }
};
<div align="center">
</div>

# Run and deploy your TubeIntel AI

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1ncG63xoDAQSs2sBpxogeBIMMTxmTmmCk

## Problem Statement

- Creators and analysts need quick, actionable insights from YouTube channels and videos, but manually collecting and interpreting metrics (views, watch time, engagement, and trends) is time-consuming and error-prone.

## Solution

- This project provides an AI-powered web app that fetches YouTube metrics, generates human-readable insights using Gemini, and visualizes results to help creators optimize content and grow audiences.

**Key features:**
- Aggregates channel and video metrics via the YouTube API
- Generates natural-language summaries and recommendations using Gemini
- Interactive dashboards and visualizations (`MetricCard`, `VideoChart`, `ReportView`)
- Easy local deployment and extensible architecture

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` and `YOUTUBE_API_KEY` in `.env.local` to your Gemini and YouTube API keys
3. Run the app:
   `npm run dev`

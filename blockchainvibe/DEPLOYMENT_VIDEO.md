# Demo Video Deployment Instructions

## Current Status

The demo video has been integrated into the landing page. However, due to Cloudflare Pages file size limitations (25MB max per file), the 315MB video cannot be directly deployed.

## Solutions

### Option 1: Upload to YouTube (Recommended - Easiest)

1. Upload your video to YouTube (can be unlisted for privacy)
2. Get the embed URL (e.g., `https://www.youtube.com/embed/VIDEO_ID`)
3. Set environment variable in Cloudflare Pages:
   - Go to Pages → Settings → Environment Variables
   - Add: `REACT_APP_DEMO_VIDEO_URL` = `https://www.youtube.com/embed/VIDEO_ID`
4. Redeploy

### Option 2: Upload to Vimeo

1. Upload video to Vimeo
2. Get embed URL
3. Set `REACT_APP_DEMO_VIDEO_URL` environment variable
4. Redeploy

### Option 3: Host on Cloudflare R2

1. Create an R2 bucket
2. Upload the video to R2
3. Create a public URL or use R2's CDN
4. Set `REACT_APP_DEMO_VIDEO_URL` to the R2 URL
5. Update the code if needed for direct video playback from R2

### Option 4: Compress Video

Compress the video to under 25MB using tools like:
- HandBrake
- FFmpeg
- Online compression tools

Then deploy directly.

## Current Implementation

The code supports both options:
- If `REACT_APP_DEMO_VIDEO_URL` is set → Uses iframe embed (YouTube/Vimeo)
- If not set → Uses local video file `/demo-video.mp4`

## For Hackathon Submission

The full video is available in:
- `demo/BlockchainVibe-Demo.mp4` (in GitHub repo via Git LFS)
- Judges can download or view directly from the repository

## Video Files in Repository

- `public/demo-video.mp4` - For local development (315MB, via Git LFS)
- `demo/BlockchainVibe-Demo.mp4` - For hackathon submission (315MB, via Git LFS)

Both files are tracked using Git LFS to handle the large file size.


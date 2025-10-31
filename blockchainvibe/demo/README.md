# BlockchainVibe Demo Video

This folder contains the demo video for the BlockchainVibe platform.

## Video File

- **File**: `BlockchainVibe-Demo.mp4`
- **Location**: `demo/BlockchainVibe-Demo.mp4`
- **Size**: ~315 MB
- **Format**: MP4 (H.264)

## Usage

### For Hackathon Submission

The full demo video is available in this folder for hackathon submission. Judges can download or view the video directly from the GitHub repository.

### For Live Website

Due to Cloudflare Pages file size limitations (25MB max), the video is hosted using Git LFS in the repository. For the live deployment, we recommend:

1. **Upload to YouTube/Vimeo** and embed using an iframe
2. **Host on Cloudflare R2** (object storage) and serve from there
3. **Compress the video** to under 25MB for direct hosting

## Video Source

The original video was created using CapCut and is located at:
`C:\Users\chiku\AppData\Local\CapCut\Videos\BlockchainVibe Demo\BlockchainVibe Demo.mp4`

## Embedding Options

### Option 1: YouTube Embed
```html
<iframe 
  width="100%" 
  height="auto" 
  src="YOUTUBE_EMBED_URL" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen>
</iframe>
```

### Option 2: Vimeo Embed
```html
<iframe 
  src="VIMEO_EMBED_URL" 
  width="100%" 
  height="auto" 
  frameborder="0" 
  allow="autoplay; fullscreen; picture-in-picture" 
  allowfullscreen>
</iframe>
```

### Option 3: Cloudflare R2 (Recommended for Production)
Store the video in Cloudflare R2 bucket and serve via CDN.


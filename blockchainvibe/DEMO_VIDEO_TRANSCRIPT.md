# BlockchainVibe Demo Video Transcript (3-5 minutes)

## Script for AI Voiceover

---

**[0:00 - 0:20] INTRODUCTION**

Hi, I'm [Your Name], and welcome to BlockchainVibe. 

This is an AI-powered blockchain news aggregator built with Fetch.ai's uAgents framework, SingularityNET's MeTTa Knowledge Graph, and deployed on Cloudflare Workers and Pages.

Today, I'll show you how our intelligent agents process news, personalize content, and provide real-time insights.

---

**[0:20 - 0:40] LANDING PAGE & ANIMATED BACKGROUND**

*[Show landing page]*

Notice the beautiful animated background across all pages—floating blocks, particles, network lines, and hexagons. This creates a cohesive, modern aesthetic throughout the platform.

*[Navigate briefly]*

The platform is fully responsive and features a clean, intuitive interface that works seamlessly on all devices.

---

**[0:40 - 1:10] AUTHENTICATION & PROFILE MANAGEMENT**

*[Click Sign In]*

First, let's sign in using OAuth—we support Google, GitHub, Twitter, and Discord.

*[Sign in with preferred provider]*

Once authenticated, you'll land on the dashboard. 

*[Navigate to Settings]*

In Settings, users can manage their profile. Watch as I update my name and bio, then change my profile picture and banner image.

*[Update profile fields, upload images]*

Notice how the changes save instantly to our Cloudflare D1 database, and images are stored in Cloudflare R2 storage.

*[Click Save Changes - show success toast]*

The profile updates immediately, and we can see the changes reflected on the Profile page.

*[Navigate to Profile page]*

All profile data is now displaying correctly, with real-time synchronization between our frontend and backend.

---

**[1:10 - 1:50] NEWS FEED WITH FILTERS**

*[Navigate to News Feed page]*

The News Feed page features our personalized news aggregation.

*[Show filter dropdowns below header]*

Here, you'll notice elegant dropdown filters—Timeframe and Category—positioned below the header to prevent overflow and maintain a clean layout.

*[Change timeframe dropdown to "7 Days"]*

When I select "7 Days", the feed refreshes automatically.

*[Change category dropdown to "DeFi"]*

Now, selecting "DeFi" as the category, the feed updates to show only DeFi-related articles.

*[Scroll through articles]*

Each article card shows the source, publication time, and relevance score.

*[Click "Read more" on an article]*

When I click "Read more", the article opens in a new tab, and our system tracks this reading activity in our D1 database.

This tracking enables personalized recommendations and analytics.

---

**[1:50 - 2:20] TRENDING PAGE WITH FILTERS**

*[Navigate to Trending page]*

The Trending page showcases the most popular blockchain news across the community.

*[Show dropdown filters: Timeframe, Category, Sort]*

Similar to the News Feed, we use clean dropdown menus for filters—Timeframe, Category, and Sort options.

*[Change sort to "Most Recent"]*

*[Change category to "Layer 2"]*

The articles update dynamically based on our selections.

*[Click "Load More"]*

We can load additional articles, and everything updates in real-time.

*[Click Refresh button]*

The refresh button fetches the latest trending content.

---

**[2:20 - 2:50] PERSONALIZED FOR YOU PAGE**

*[Navigate to For You page]*

The "For You" page is where AI personalization truly shines.

*[Show stats cards]*

At the top, you see stats like Articles Read, Saved Articles, and other metrics pulled from real user activity.

*[Scroll through personalized feed]*

Each article here is curated specifically for the user based on their reading history, preferences, and interactions.

Our Fetch.ai uAgents work in the background to analyze user behavior and score articles for relevance.

The SingularityNET MeTTa Knowledge Graph enhances this by extracting entities, mapping relationships, and categorizing content.

---

**[2:50 - 3:20] ANALYTICS DASHBOARD**

*[Navigate to Analytics page]*

The Analytics Dashboard provides comprehensive insights into your blockchain news consumption.

*[Point to stat cards]*

You can see Articles Read, Active Days This Week, and Relevance Score—all calculated from real data in our D1 database.

*[Point to Reading Trends chart]*

The Reading Trends chart visualizes your activity patterns throughout the week.

*[Scroll to AI-Powered Insights section]*

Perhaps most impressive is the AI-Powered Insights section.

*[Show insights if available]*

These insights are generated from your actual reading activity—like "Most-read source this week: CoinDesk" or "You typically read around 14:00."

These aren't mock data—they're real insights derived from your user activity stored in D1.

---

**[3:20 - 3:40] SAVED & LIKED ARTICLES**

*[Navigate to Trending or News Feed]*

Let me demonstrate the saved and liked articles feature.

*[Click heart icon on an article]*

When I like an article, it's tracked immediately.

*[Click bookmark icon]*

Similarly, when I save an article, it's recorded.

*[Navigate to Liked Articles page]*

Now, if I go to the Liked Articles page, you'll see my liked articles displayed.

*[Navigate to Saved Articles page]*

And the Saved Articles page shows my bookmarked content.

Both pages fetch data from our API, which queries the D1 database for all user activity of type "like" or "bookmark."

No mock data here—everything is real and persistent.

---

**[3:40 - 4:20] AI AGENTS & ASI:ONE INTEGRATION**

*[Navigate to API documentation or show code briefly]*

Behind the scenes, we have two specialized uAgents working continuously.

First, the **BlockchainVibe News Fetcher Agent**—with ID "blockchainvibe-news-fetcher."

This agent fetches news from multiple blockchain RSS sources, processes content, and scores quality.

Second, the **BlockchainVibe Relevance Scorer Agent**—with ID "blockchainvibe-relevance-scorer."

This agent calculates personalized relevance scores using AI and user profiling.

Both agents are registered with Chat Protocol and are ASI:One compatible, meaning they can be discovered and interacted with through the ASI:One interface.

*[Show Analytics or mention chat endpoint]*

The agents use SingularityNET's MeTTa Knowledge Graph to extract blockchain entities, map relationships, and enhance categorization.

You can query these agents via our Chat Protocol endpoint at `/api/chat/message`, and they provide intelligent responses about news and user insights.

---

**[4:20 - 5:00] INFRASTRUCTURE & CONCLUSION**

*[Briefly mention infrastructure]*

Our infrastructure is built entirely on Cloudflare.

The backend runs on Cloudflare Workers, handling API requests, OAuth, and database operations.

Static assets like profile pictures and banner images are stored in Cloudflare R2.

User data and activity tracking are stored in Cloudflare D1—a serverless SQL database.

The frontend is deployed on Cloudflare Pages, providing global CDN distribution.

*[Show GitHub link or README]*

All code is available on GitHub, and our README includes agent details, capabilities, and links to all resources.

We're proud to be categorized under Innovation Lab and built for this hackathon.

---

**[CONCLUSION]**

BlockchainVibe demonstrates how Fetch.ai uAgents, SingularityNET MeTTa, and Cloudflare can work together to create a truly intelligent, personalized news platform.

Thank you for watching, and feel free to explore BlockchainVibe yourself.

The link is in the description below.


// Test RSS parsing
import { NewsAggregator } from './news-aggregator.js';

const aggregator = new NewsAggregator();

async function testRSSParsing() {
  console.log('Testing RSS parsing...');
  
  try {
    const news = await aggregator.fetchNews({
      limit: 5,
      category: 'all',
      timeFilter: '24h',
      sortBy: 'relevance'
    });
    
    console.log('Fetched news:', news.length);
    console.log('First article:', news[0]);
  } catch (error) {
    console.error('Error:', error);
  }
}

testRSSParsing();

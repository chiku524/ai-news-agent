// Article Deduplication Utility
// Detects and handles duplicate articles from different sources

/**
 * Calculate similarity between two articles using multiple factors
 */
function calculateSimilarity(article1, article2) {
  let similarity = 0;
  let factors = 0;

  // Title similarity (weight: 40%)
  const titleSimilarity = textSimilarity(article1.title, article2.title);
  similarity += titleSimilarity * 0.4;
  factors += 0.4;

  // URL similarity (weight: 30%) - if URLs are very similar, likely same article
  if (article1.url && article2.url) {
    const urlSimilarity = urlSimilarity(article1.url, article2.url);
    similarity += urlSimilarity * 0.3;
    factors += 0.3;
  }

  // Content/Summary similarity (weight: 20%)
  const content1 = article1.content || article1.summary || article1.excerpt || '';
  const content2 = article2.content || article2.summary || article2.excerpt || '';
  if (content1 && content2) {
    const contentSimilarity = textSimilarity(content1.substring(0, 500), content2.substring(0, 500));
    similarity += contentSimilarity * 0.2;
    factors += 0.2;
  }

  // Published time similarity (weight: 10%) - same article usually published around same time
  if (article1.published_at && article2.published_at) {
    const time1 = new Date(article1.published_at).getTime();
    const time2 = new Date(article2.published_at).getTime();
    const timeDiff = Math.abs(time1 - time2);
    const timeSimilarity = timeDiff < 24 * 60 * 60 * 1000 ? 1 - (timeDiff / (24 * 60 * 60 * 1000)) : 0;
    similarity += timeSimilarity * 0.1;
    factors += 0.1;
  }

  return factors > 0 ? similarity / factors : 0;
}

/**
 * Calculate text similarity using Jaccard similarity and word overlap
 */
function textSimilarity(text1, text2) {
  if (!text1 || !text2) return 0;

  const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(w => w.length > 2));
  const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(w => w.length > 2));

  if (words1.size === 0 || words2.size === 0) return 0;

  // Jaccard similarity
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  const jaccard = intersection.size / union.size;

  // Word overlap
  const overlap = intersection.size / Math.min(words1.size, words2.size);

  // Combined similarity
  return (jaccard * 0.6 + overlap * 0.4);
}

/**
 * Calculate URL similarity
 */
function urlSimilarity(url1, url2) {
  if (!url1 || !url2) return 0;

  // Normalize URLs
  const normalizeUrl = (url) => {
    try {
      const u = new URL(url);
      // Remove query parameters and fragments
      return `${u.protocol}//${u.host}${u.pathname}`.toLowerCase();
    } catch {
      return url.toLowerCase();
    }
  };

  const norm1 = normalizeUrl(url1);
  const norm2 = normalizeUrl(url2);

  // Exact match
  if (norm1 === norm2) return 1.0;

  // Check if one URL contains the other
  if (norm1.includes(norm2) || norm2.includes(norm1)) return 0.8;

  // Check path similarity
  const path1 = new URL(url1).pathname.toLowerCase();
  const path2 = new URL(url2).pathname.toLowerCase();
  
  if (path1 === path2) return 0.9;
  
  // Calculate path similarity
  const pathWords1 = path1.split('/').filter(p => p.length > 0);
  const pathWords2 = path2.split('/').filter(p => p.length > 0);
  const commonPaths = pathWords1.filter(p => pathWords2.includes(p));
  
  return commonPaths.length / Math.max(pathWords1.length, pathWords2.length);
}

/**
 * Deduplicate articles based on similarity threshold
 * @param {Array} articles - Array of articles to deduplicate
 * @param {number} similarityThreshold - Threshold for considering articles duplicates (0-1)
 * @returns {Array} Deduplicated articles
 */
export function deduplicateArticles(articles, similarityThreshold = 0.75) {
  if (!articles || articles.length === 0) return [];

  const deduplicated = [];
  const processed = new Set();

  // Sort by priority (higher priority sources first)
  const sortedArticles = [...articles].sort((a, b) => {
    const priorityA = a.source_priority || 4;
    const priorityB = b.source_priority || 4;
    return priorityA - priorityB; // Lower number = higher priority
  });

  for (let i = 0; i < sortedArticles.length; i++) {
    if (processed.has(i)) continue;

    const article = sortedArticles[i];
    const duplicates = [i];

    // Find duplicates
    for (let j = i + 1; j < sortedArticles.length; j++) {
      if (processed.has(j)) continue;

      const similarity = calculateSimilarity(article, sortedArticles[j]);
      
      if (similarity >= similarityThreshold) {
        duplicates.push(j);
        processed.add(j);
      }
    }

    // Keep the best article from duplicates
    if (duplicates.length > 1) {
      // Choose article with highest priority source, or best quality
      const duplicateArticles = duplicates.map(idx => sortedArticles[idx]);
      const bestArticle = duplicateArticles.reduce((best, current) => {
        // Prefer articles with images
        if (current.image_url && !best.image_url) return current;
        if (!current.image_url && best.image_url) return best;
        
        // Prefer articles with more content
        const currentContent = (current.content || current.summary || '').length;
        const bestContent = (best.content || best.summary || '').length;
        if (currentContent > bestContent) return current;
        
        // Prefer higher priority source
        const currentPriority = current.source_priority || 4;
        const bestPriority = best.source_priority || 4;
        if (currentPriority < bestPriority) return current;
        
        return best;
      });

      // Add source information about duplicates
      bestArticle.duplicate_sources = duplicateArticles
        .map(a => a.source)
        .filter((source, idx, arr) => arr.indexOf(source) === idx); // Unique sources
      bestArticle.duplicate_count = duplicates.length;

      deduplicated.push(bestArticle);
    } else {
      deduplicated.push(article);
    }

    processed.add(i);
  }

  return deduplicated;
}

/**
 * Quick deduplication using URL and title hash
 * Faster but less accurate than similarity-based deduplication
 */
export function quickDeduplicate(articles) {
  const seen = new Map();
  const deduplicated = [];

  for (const article of articles) {
    // Create hash from URL and title
    const urlHash = article.url ? new URL(article.url).pathname.toLowerCase() : '';
    const titleHash = article.title ? article.title.toLowerCase().substring(0, 50) : '';
    const hash = `${urlHash}|${titleHash}`;

    if (!seen.has(hash)) {
      seen.set(hash, true);
      deduplicated.push(article);
    }
  }

  return deduplicated;
}


# Bug Report

Found a bug? Help us improve BlockchainVibe by reporting it! This guide will help you submit a clear, helpful bug report.

---

## 🐛 How to Report a Bug

### Bug Report Channels

1. **[GitHub Issues](https://github.com/blockchainvibe/issues)** - Preferred for technical bugs
2. **Email**: [support@blockchainvibe.news](mailto:support@blockchainvibe.news) - Include "BUG REPORT" in subject
3. **Contact Form**: Use the [Contact Us](./contact-us.md) form

---

## 📋 Bug Report Template

Use this template to report bugs:

```markdown
**Bug Title**: [Brief description of the bug]

**Category**: [Account / News / Personalization / Analytics / UI / Performance / Other]

**Priority**: [Low / Normal / High / Critical]

**Description**: 
[Clear description of what happened vs. what you expected]

**Steps to Reproduce**:
1. [First step]
2. [Second step]
3. [Third step]
...

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happened]

**Screenshots**:
[Attach screenshots if relevant]

**Error Messages**:
[Any error messages or console logs]

**Environment**:
- Browser: [Chrome / Firefox / Safari / Edge / Other]
- Version: [Browser version]
- OS: [Windows / macOS / Linux / iOS / Android]
- Device: [Desktop / Tablet / Mobile]
- BlockchainVibe Version: [If visible]

**Frequency**:
[Always / Sometimes / Once]

**Additional Context**:
[Any other relevant information]
```

---

## 📝 Detailed Bug Report Guide

### 1. Bug Title

**Good Examples**:
- "Articles not loading on News Feed page"
- "Cannot save articles after signing in"
- "Profile picture upload fails with large images"

**Bad Examples**:
- "It's broken"
- "Bug in the app"
- "Something's wrong"

### 2. Category

Select the appropriate category:

- **Account**: Authentication, profile, settings
- **News**: Article display, filtering, search
- **Personalization**: Recommendations, relevance scoring
- **Analytics**: Statistics, insights, charts
- **UI**: Interface, design, layout
- **Performance**: Speed, loading, responsiveness
- **Other**: Issues that don't fit above categories

### 3. Priority

**Critical**: Platform is down, data loss, security issues
**High**: Major feature broken, significant impact
**Normal**: Feature partially broken, moderate impact
**Low**: Minor issues, cosmetic problems

### 4. Description

Provide a clear, detailed description:

**Good Description**:
"When I try to save an article on the News Feed page, clicking the bookmark icon does nothing. The icon doesn't change state, and the article doesn't appear in my Saved Articles page. This happens with all articles."

**Bad Description**:
"The save button doesn't work."

### 5. Steps to Reproduce

Include step-by-step instructions:

**Good Steps**:
1. Sign in to BlockchainVibe
2. Navigate to News Feed page
3. Find any article
4. Click the bookmark icon (🔖)
5. Observe that the icon doesn't change
6. Navigate to Saved Articles page
7. Confirm the article is not listed

**Bad Steps**:
1. Go to the site
2. Try to save something
3. It doesn't work

### 6. Expected vs. Actual Behavior

**Expected Behavior**:
When clicking the bookmark icon, it should:
- Change appearance (filled/unfilled)
- Show a success notification
- Add the article to Saved Articles page

**Actual Behavior**:
When clicking the bookmark icon:
- Nothing happens
- No visual feedback
- Article doesn't save

### 7. Screenshots

Screenshots help us understand the issue:

- **Before/After**: Show state before and after the bug
- **Error Messages**: Capture any error messages
- **Browser Console**: If relevant, include console errors
- **Network Tab**: If relevant, include network errors

**How to Take Screenshots**:
- **Windows**: `Win + Shift + S` or `Print Screen`
- **macOS**: `Cmd + Shift + 3` or `Cmd + Shift + 4`
- **Browser**: Right-click > Inspect > Screenshot

### 8. Error Messages

Include any error messages:

**From Browser Console**:
1. Open Developer Tools (F12)
2. Go to Console tab
3. Copy any error messages

**From Network Tab**:
1. Open Developer Tools (F12)
2. Go to Network tab
3. Find failed requests
4. Copy error details

### 9. Environment Information

Include your environment:

```
Browser: Chrome 120.0.6099.109
Version: Latest
OS: Windows 11
Device: Desktop
Screen Resolution: 1920x1080
BlockchainVibe Version: 1.0.0 (if visible)
```

### 10. Frequency

Indicate how often the bug occurs:

- **Always**: Happens every time
- **Sometimes**: Happens occasionally
- **Once**: Happened only once

### 11. Additional Context

Include any other relevant information:

- **Workaround**: If you found a workaround
- **Related Issues**: If related to other issues
- **User Impact**: How many users affected
- **Business Impact**: If applicable

---

## 🔍 Common Bug Categories

### Account & Authentication

**Common Issues**:
- Cannot sign in with OAuth
- OAuth redirect fails
- Account not created after sign-in
- Profile not saving
- Account deletion not working

**What to Include**:
- OAuth provider used (Google/GitHub/Twitter/Discord)
- Error messages from OAuth provider
- Browser console errors
- Network tab errors

### News & Articles

**Common Issues**:
- Articles not loading
- Articles appearing in wrong categories
- Search not finding articles
- Filters not working
- Pagination not working

**What to Include**:
- Article URLs that fail
- Search queries that don't work
- Filter combinations that fail
- Screenshots of incorrect display

### Personalization

**Common Issues**:
- "For You" page not showing recommendations
- Relevance scores seem incorrect
- Recommendations not updating
- Personalization not working

**What to Include**:
- Your interests in Settings
- Articles you've read recently
- Examples of incorrect recommendations
- Expected vs. actual recommendations

### Analytics & Insights

**Common Issues**:
- Statistics not updating
- Charts not displaying
- Insights not appearing
- Analytics incorrect

**What to Include**:
- Expected vs. actual statistics
- Screenshots of incorrect analytics
- Time period for analytics
- Account activity during period

### UI & Design

**Common Issues**:
- Layout broken on specific screen sizes
- Buttons not clickable
- Text overlapping
- Colors not displaying correctly

**What to Include**:
- Screen resolution
- Browser and version
- Screenshots of layout issues
- Device type (desktop/tablet/mobile)

### Performance

**Common Issues**:
- Slow page loading
- Unresponsive interface
- High CPU/memory usage
- Network requests timing out

**What to Include**:
- Page load times
- Network speed
- Browser performance metrics
- Screenshots of performance profiler

---

## ✅ Before Submitting

Check these before submitting:

1. **Is it a bug?** - Make sure it's actually a bug, not a feature request
2. **Is it already reported?** - Check [GitHub Issues](https://github.com/blockchainvibe/issues)
3. **Is it fixed?** - Check if it's already fixed in latest version
4. **Can you reproduce it?** - Try to reproduce it again
5. **Is information complete?** - Include all relevant details

---

## 🎯 Bug Report Examples

### Example 1: Simple Bug

```markdown
**Bug Title**: Bookmark icon not saving articles

**Category**: News

**Priority**: High

**Description**: 
When clicking the bookmark icon on any article, nothing happens. The icon doesn't change state, and the article doesn't appear in Saved Articles.

**Steps to Reproduce**:
1. Sign in to BlockchainVibe
2. Go to News Feed page
3. Click bookmark icon on any article
4. Navigate to Saved Articles page
5. Article is not listed

**Expected Behavior**: Article should be saved and appear in Saved Articles

**Actual Behavior**: Nothing happens, article not saved

**Environment**:
- Browser: Chrome 120.0.6099.109
- OS: Windows 11
- Device: Desktop

**Frequency**: Always
```

### Example 2: Complex Bug

```markdown
**Bug Title**: "For You" page shows irrelevant articles after interest update

**Category**: Personalization

**Priority**: Normal

**Description**: 
After updating interests in Settings, the "For You" page continues showing articles unrelated to new interests. Recommendations don't update even after reading multiple articles related to new interests.

**Steps to Reproduce**:
1. Sign in to BlockchainVibe
2. Go to Settings > Preferences
3. Change interests from ["Bitcoin", "Ethereum"] to ["DeFi", "NFT"]
4. Save preferences
5. Navigate to "For You" page
6. Articles are still about Bitcoin/Ethereum, not DeFi/NFT
7. Read 5+ DeFi/NFT articles
8. Refresh "For You" page
9. Still shows Bitcoin/Ethereum articles

**Expected Behavior**: "For You" page should update to show DeFi/NFT articles after interest change

**Actual Behavior**: "For You" page continues showing old interest articles

**Screenshots**: [Screenshots of Settings and "For You" page]

**Environment**:
- Browser: Firefox 121.0
- OS: macOS 14.2
- Device: Desktop

**Frequency**: Always

**Additional Context**: This started happening after the latest update (January 15, 2025)
```

---

## 📊 Bug Report Status

After submitting a bug report, you can track its status:

- **Open**: Bug report received, under review
- **In Progress**: Bug is being fixed
- **Resolved**: Bug is fixed, waiting for verification
- **Closed**: Bug is fixed and verified
- **Duplicate**: Bug already reported
- **Won't Fix**: Bug won't be fixed (with explanation)

---

## 🔄 Following Up

If you need to follow up on a bug report:

1. **Check Status**: Check the bug status on GitHub or via email
2. **Provide Additional Info**: If requested, provide additional information
3. **Test Fixes**: If fixed, test the fix and confirm
4. **Close Bug**: If fixed, confirm and close the bug

---

## 🙏 Thank You

Thank you for taking the time to report bugs! Your reports help us improve BlockchainVibe and provide a better experience for all users.

---

**Last Updated: January 15, 2025**

---

© 2025 BlockchainVibe. All rights reserved.


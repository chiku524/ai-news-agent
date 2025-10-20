# Complete OAuth Setup: Development + Production

## 🎯 **Strategy: Separate OAuth Apps for Each Environment**

### **Why Separate Apps?**
- ✅ **Isolation**: Development and production are completely separate
- ✅ **Security**: Different credentials for each environment
- ✅ **Testing**: Local testing stays local, production stays production
- ✅ **Debugging**: Clear separation makes issues easier to identify
- ✅ **Flexibility**: Can modify dev settings without affecting production

---

## 🔧 **Step 1: Create Development OAuth Apps**

### **GitHub Development App**
1. Go to [GitHub OAuth Apps](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. **Application name**: `AI News Agent - Development`
4. **Homepage URL**: `http://localhost:3000`
5. **Authorization callback URL**: `http://localhost:3000/auth/callback`
6. Click **"Register application"**
7. **Copy the Client ID** (starts with `Ov23li...`)
8. **Generate Client Secret** and copy it

### **Twitter Development App**
1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Click **"Create App"**
3. **App name**: `AI News Agent - Development`
4. **App description**: `Development OAuth app for AI News Agent`
5. **Website URL**: `http://localhost:3000`
6. **Callback URL**: `http://localhost:3000/auth/callback`
7. **Enable OAuth 2.0**: ✅ Yes
8. Click **"Create"**
9. **Copy the Client ID** and **Client Secret**

### **Google Development App**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services > Credentials**
3. Click **"Create Credentials > OAuth 2.0 Client ID"**
4. **Application type**: Web application
5. **Name**: `AI News Agent - Development`
6. **Authorized JavaScript origins**: `http://localhost:3000`
7. **Authorized redirect URIs**: `http://localhost:3000/auth/callback`
8. Click **"Create"**
9. **Copy the Client ID** and **Client Secret**

---

## 🚀 **Step 2: Update Production OAuth Apps**

### **GitHub Production App** (Update Existing)
1. Go to [GitHub OAuth Apps](https://github.com/settings/developers)
2. Find your existing app: `AI News Agent` (Client ID: `Ov23lisuJwAjEECYLj0y`)
3. Click **"Edit"**
4. **Authorization callback URL**: `https://blockchainvibe.news/auth/callback`
5. Click **"Update application"**

### **Twitter Production App** (Update Existing)
1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Find your existing app (Client ID: `QmVxRHdKal81ZW9QU1pfWFhpWWQ6MTpjaQ`)
3. Go to **"App settings" > "Authentication settings"**
4. **Callback URL**: `https://blockchainvibe.news/auth/callback`
5. **OAuth 2.0**: ✅ Enabled
6. Click **"Save"**

### **Google Production App** (Already Working)
- ✅ Already configured correctly

---

## 🔑 **Step 3: Environment Configuration**

### **Development Environment (.env.local)**
```env
# Development OAuth Apps
REACT_APP_GOOGLE_CLIENT_ID=your-dev-google-client-id
REACT_APP_GITHUB_CLIENT_ID=your-dev-github-client-id
REACT_APP_TWITTER_CLIENT_ID=your-dev-twitter-client-id

# Development URLs
REACT_APP_REDIRECT_URI=http://localhost:3000/auth/callback
REACT_APP_API_URL=http://localhost:8000
```

### **Production Environment (.env.production)**
```env
# Production OAuth Apps
REACT_APP_GOOGLE_CLIENT_ID=579208613672-c4pvdarqdnckdai6re7n9nei5svk72st.apps.googleusercontent.com
REACT_APP_GITHUB_CLIENT_ID=Ov23lisuJwAjEECYLj0y
REACT_APP_TWITTER_CLIENT_ID=QmVxRHdKal81ZW9QU1pfWFhpWWQ6MTpjaQ

# Production URLs
REACT_APP_REDIRECT_URI=https://blockchainvibe.news/auth/callback
REACT_APP_API_URL=https://blockchainvibe-api.nico-chikuji.workers.dev
```

---

## 🧪 **Step 4: Testing Strategy**

### **Local Development Testing**
- ✅ **OAuth redirects to**: `http://localhost:3000/auth/callback`
- ✅ **API calls go to**: `http://localhost:8000`
- ✅ **Stays completely local**
- ✅ **Uses development OAuth apps**

### **Production Testing**
- ✅ **OAuth redirects to**: `https://blockchainvibe.news/auth/callback`
- ✅ **API calls go to**: `https://blockchainvibe-api.nico-chikuji.workers.dev`
- ✅ **Uses production OAuth apps**
- ✅ **Real production environment**

---

## 📋 **Step 5: Implementation Steps**

1. **Create Development OAuth Apps** (15 minutes)
   - GitHub development app
   - Twitter development app
   - Google development app

2. **Update Production OAuth Apps** (5 minutes)
   - Fix GitHub callback URL
   - Fix Twitter callback URL

3. **Update Environment Files** (5 minutes)
   - Create `.env.local` with dev credentials
   - Update `.env.production` with prod credentials

4. **Test Both Environments** (10 minutes)
   - Test local development
   - Test production deployment

---

## 🎉 **Benefits of This Approach**

- 🔒 **Security**: Separate credentials for each environment
- 🧪 **Testing**: Local testing stays local, production stays production
- 🐛 **Debugging**: Clear separation makes issues easier to identify
- 🚀 **Deployment**: No risk of breaking production when testing locally
- 📈 **Scalability**: Easy to add staging environments later

---

## ⚠️ **Important Notes**

- **Development OAuth apps** are only for local testing
- **Production OAuth apps** are only for production
- **Never mix credentials** between environments
- **Test both environments** after setup
- **Keep credentials secure** and never commit them to git

---

**This setup gives you complete isolation between development and production OAuth flows!** 🚀

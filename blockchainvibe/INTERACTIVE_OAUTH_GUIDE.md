# 🚀 Interactive OAuth App Creation Guide

## **Step 1: GitHub OAuth App (Development)**

### **🔗 Quick Link**: [GitHub OAuth Apps](https://github.com/settings/developers)

### **📋 Step-by-Step Instructions**:

1. **Click the link above** (opens in new tab)
2. **Click "New OAuth App"** (green button)
3. **Fill in the form**:
   - **Application name**: `AI News Agent - Development`
   - **Homepage URL**: `http://localhost:3000`
   - **Application description**: `Development OAuth app for AI News Agent local testing`
   - **Authorization callback URL**: `http://localhost:3000/auth/callback`
4. **Click "Register application"**
5. **Copy the Client ID** (starts with `Ov23li...`)
6. **Click "Generate a new client secret"**
7. **Copy the Client Secret** (starts with `7567121f79...`)

### **📝 Save These Credentials**:
```
GitHub Development Client ID: ________________
GitHub Development Client Secret: ________________
```

---

## **Step 2: Twitter OAuth App (Development)**

### **🔗 Quick Link**: [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)

### **📋 Step-by-Step Instructions**:

1. **Click the link above** (opens in new tab)
2. **Click "Create App"** (blue button)
3. **Fill in the form**:
   - **App name**: `AI News Agent - Development`
   - **App description**: `Development OAuth app for AI News Agent local testing`
   - **Website URL**: `http://localhost:3000`
   - **Callback URL**: `http://localhost:3000/auth/callback`
   - **OAuth 2.0**: ✅ **Check this box**
4. **Click "Create"**
5. **Go to "Keys and tokens" tab**
6. **Copy the Client ID** (starts with `QmVxRHdKal81ZW9QU1pfWFhpWWQ6MTpjaQ`)
7. **Copy the Client Secret** (starts with `Qw8ImtckPx...`)

### **📝 Save These Credentials**:
```
Twitter Development Client ID: ________________
Twitter Development Client Secret: ________________
```

---

## **Step 3: Google OAuth App (Development)**

### **🔗 Quick Link**: [Google Cloud Console](https://console.cloud.google.com/)

### **📋 Step-by-Step Instructions**:

1. **Click the link above** (opens in new tab)
2. **Navigate to**: APIs & Services > Credentials
3. **Click "Create Credentials" > "OAuth 2.0 Client ID"**
4. **If prompted, configure OAuth consent screen first**:
   - **User Type**: External
   - **App name**: `AI News Agent - Development`
   - **User support email**: Your email
   - **Developer contact**: Your email
   - **Save and continue** through all steps
5. **Back to Credentials, click "Create Credentials" > "OAuth 2.0 Client ID"**
6. **Fill in the form**:
   - **Application type**: Web application
   - **Name**: `AI News Agent - Development`
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/auth/callback`
7. **Click "Create"**
8. **Copy the Client ID** (starts with `579208613672-...`)
9. **Copy the Client Secret** (starts with `GOCSPX-...`)

### **📝 Save These Credentials**:
```
Google Development Client ID: ________________
Google Development Client Secret: ________________
```

---

## **Step 4: Update Configuration Files**

Once you have all the credentials, I'll help you update the configuration files. Just provide me with the credentials and I'll:

1. ✅ Update `.env.local` with development credentials
2. ✅ Update the backend secrets for development
3. ✅ Test the local development setup
4. ✅ Verify everything works correctly

---

## **🎯 What You'll Get**

After completing these steps:
- ✅ **Local Development**: OAuth redirects to `http://localhost:3000`
- ✅ **Production**: OAuth redirects to `https://blockchainvibe.news`
- ✅ **Complete Isolation**: No cross-environment issues
- ✅ **Easy Testing**: Local testing stays local

---

## **⏱️ Estimated Time**: 15-20 minutes

**Ready to start? Begin with Step 1 (GitHub) and let me know when you have the credentials!** 🚀


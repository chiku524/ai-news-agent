// Social Authentication Service
class SocialAuthService {
  constructor() {
    this.googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    this.githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
    this.twitterClientId = process.env.REACT_APP_TWITTER_CLIENT_ID;
    this.redirectUri = process.env.REACT_APP_REDIRECT_URI || window.location.origin;
    
  }

  // Google OAuth
  async signInWithGoogle() {
    try {
      // Check if we're in demo mode (no client ID configured)
      if (!this.googleClientId || this.googleClientId === 'your_google_client_id_here' || this.googleClientId.trim() === '') {
        this.handleDemoAuth('Google');
        return;
      }
      
      // Use Google's OAuth 2.0 flow
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${this.googleClientId}&` +
        `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
        `response_type=code&` +
        `scope=openid%20email%20profile&` +
        `access_type=offline`;

      // Redirect to Google OAuth
      window.location.href = googleAuthUrl;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw new Error('Failed to sign in with Google');
    }
  }

  async loadGoogleAPI() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: this.googleClientId,
        });
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  handleGoogleCallback(response) {
    // Send the authorization code to your backend
    fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: response.code,
        redirect_uri: this.redirectUri
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Store tokens and redirect
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/dashboard';
      } else {
        throw new Error(data.error || 'Authentication failed');
      }
    })
    .catch(error => {
      console.error('Google authentication error:', error);
      alert('Google authentication failed. Please try again.');
    });
  }

  // GitHub OAuth
  async signInWithGitHub() {
    try {
      // Check if we're in demo mode (no client ID configured)
      if (!this.githubClientId || this.githubClientId === 'your_github_client_id_here' || this.githubClientId.trim() === '') {
        this.handleDemoAuth('GitHub');
        return;
      }
      
      const githubAuthUrl = `https://github.com/login/oauth/authorize?` +
        `client_id=${this.githubClientId}&` +
        `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
        `scope=user:email`;

      // Redirect to GitHub OAuth
      window.location.href = githubAuthUrl;
    } catch (error) {
      console.error('GitHub sign-in error:', error);
      throw new Error('Failed to sign in with GitHub');
    }
  }

  // X (Twitter) OAuth
  async signInWithX() {
    try {
      // Check if we're in demo mode (no client ID configured)
      if (!this.twitterClientId || this.twitterClientId === 'your_twitter_client_id_here' || this.twitterClientId.trim() === '') {
        this.handleDemoAuth('X');
        return;
      }
      
      const twitterAuthUrl = `https://twitter.com/i/oauth2/authorize?` +
        `response_type=code&` +
        `client_id=${this.twitterClientId}&` +
        `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
        `scope=tweet.read%20users.read&` +
        `state=state&` +
        `code_challenge=challenge&` +
        `code_challenge_method=plain`;

      // Redirect to X (Twitter) OAuth
      window.location.href = twitterAuthUrl;
    } catch (error) {
      console.error('X sign-in error:', error);
      throw new Error('Failed to sign in with X');
    }
  }

  // Handle OAuth callbacks (for popup windows)
  handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      window.opener?.postMessage({
        type: 'GITHUB_AUTH_ERROR',
        error: error
      }, window.location.origin);
      return;
    }

    if (code) {
      // Determine which provider based on the current URL or state
      const provider = this.detectProvider();
      
      if (provider === 'github') {
        this.handleGitHubCallback(code);
      } else if (provider === 'twitter') {
        this.handleTwitterCallback(code);
      }
    }
  }

  detectProvider() {
    // This would be set by the popup window or determined by URL parameters
    return localStorage.getItem('oauth_provider') || 'github';
  }

  async handleGitHubCallback(code) {
    try {
      const response = await fetch('/api/auth/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          redirect_uri: this.redirectUri
        })
      });

      const data = await response.json();
      
      if (data.success) {
        window.opener?.postMessage({
          type: 'GITHUB_AUTH_SUCCESS',
          access_token: data.access_token,
          user: data.user
        }, window.location.origin);
      } else {
        throw new Error(data.error || 'GitHub authentication failed');
      }
    } catch (error) {
      console.error('GitHub callback error:', error);
      window.opener?.postMessage({
        type: 'GITHUB_AUTH_ERROR',
        error: error.message
      }, window.location.origin);
    }
  }

  async handleTwitterCallback(code) {
    try {
      const response = await fetch('/api/auth/twitter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          redirect_uri: this.redirectUri
        })
      });

      const data = await response.json();
      
      if (data.success) {
        window.opener?.postMessage({
          type: 'TWITTER_AUTH_SUCCESS',
          access_token: data.access_token,
          user: data.user
        }, window.location.origin);
      } else {
        throw new Error(data.error || 'Twitter authentication failed');
      }
    } catch (error) {
      console.error('Twitter callback error:', error);
      window.opener?.postMessage({
        type: 'TWITTER_AUTH_ERROR',
        error: error.message
      }, window.location.origin);
    }
  }

  // Demo authentication for testing without OAuth setup
  handleDemoAuth(provider) {
    const demoUsers = {
      Google: {
        id: 'demo_google_123',
        email: 'demo.google@example.com',
        name: 'Demo Google User',
        picture: 'https://via.placeholder.com/150/4285F4/FFFFFF?text=G',
        provider: 'google'
      },
      GitHub: {
        id: 'demo_github_456',
        email: 'demo.github@example.com',
        name: 'Demo GitHub User',
        picture: 'https://via.placeholder.com/150/333333/FFFFFF?text=GH',
        provider: 'github'
      },
      X: {
        id: 'demo_twitter_789',
        email: 'demo.twitter@example.com',
        name: 'Demo X User',
        picture: 'https://via.placeholder.com/150/1DA1F2/FFFFFF?text=X',
        provider: 'twitter'
      }
    };

    const user = demoUsers[provider];
    if (user) {
      // Create demo tokens
      const accessToken = `demo_${provider.toLowerCase()}_token_${Date.now()}`;
      const refreshToken = `demo_${provider.toLowerCase()}_refresh_${Date.now()}`;
      
      // Store demo authentication
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Show success message
      alert(`Demo ${provider} authentication successful! Redirecting to dashboard...`);
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    }
  }

  // Sign out
  signOut() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('github_token');
    localStorage.removeItem('twitter_token');
    localStorage.removeItem('oauth_provider');
    window.location.href = '/';
  }

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }
}

// Create singleton instance
const socialAuthService = new SocialAuthService();

export default socialAuthService;

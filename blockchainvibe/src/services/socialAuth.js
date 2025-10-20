// Social Authentication Service
class SocialAuthService {
  constructor() {
    this.googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    this.githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
    this.twitterClientId = process.env.REACT_APP_TWITTER_CLIENT_ID;
    this.redirectUri = process.env.REACT_APP_REDIRECT_URI || window.location.origin;
    
    // Debug environment variables
    console.log('SocialAuth Environment Variables:');
    console.log('REACT_APP_GOOGLE_CLIENT_ID:', this.googleClientId);
    console.log('REACT_APP_GITHUB_CLIENT_ID:', this.githubClientId);
    console.log('REACT_APP_TWITTER_CLIENT_ID:', this.twitterClientId);
    console.log('REACT_APP_REDIRECT_URI:', this.redirectUri);
    console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
  }

  // Google OAuth
  async signInWithGoogle() {
    try {
      // Check if we're in demo mode (no client ID configured)
      if (!this.googleClientId || this.googleClientId === 'your_google_client_id_here' || this.googleClientId.trim() === '') {
        this.handleDemoAuth('Google');
        return;
      }
      
      // Store provider in localStorage for callback detection
      localStorage.setItem('oauth_provider', 'google');
      
      // Use Google's OAuth 2.0 flow
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${this.googleClientId}&` +
        `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
        `response_type=code&` +
        `scope=openid%20email%20profile&` +
        `access_type=offline&` +
        `state=google`;

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


  // GitHub OAuth
  async signInWithGitHub() {
    try {
      // Check if we're in demo mode (no client ID configured)
      if (!this.githubClientId || this.githubClientId === 'your_github_client_id_here' || this.githubClientId.trim() === '') {
        this.handleDemoAuth('GitHub');
        return;
      }
      
      // Store provider in localStorage for callback detection
      localStorage.setItem('oauth_provider', 'github');
      
      // Add a random parameter to force GitHub to show authorization screen
      const randomParam = Math.random().toString(36).substring(7);
      
      const githubAuthUrl = `https://github.com/login/oauth/authorize?` +
        `client_id=${this.githubClientId}&` +
        `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
        `scope=user:email&` +
        `state=github&` +
        `allow_signup=true&` +
        `random=${randomParam}&` +
        `prompt=consent`;

      console.log('GitHub OAuth URL:', githubAuthUrl);
      console.log('GitHub Client ID:', this.githubClientId);
      console.log('Redirect URI:', this.redirectUri);

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
      
      // Store provider in localStorage for callback detection
      localStorage.setItem('oauth_provider', 'twitter');
      
      // Generate PKCE code challenge
      const codeVerifier = this.generateCodeVerifier();
      const codeChallenge = await this.generateCodeChallenge(codeVerifier);
      
      // Store code verifier for later use
      localStorage.setItem('twitter_code_verifier', codeVerifier);
      
      const twitterAuthUrl = `https://twitter.com/i/oauth2/authorize?` +
        `response_type=code&` +
        `client_id=${this.twitterClientId}&` +
        `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
        `scope=tweet.read%20users.read&` +
        `state=twitter&` +
        `code_challenge=${codeChallenge}&` +
        `code_challenge_method=S256`;

      console.log('Twitter OAuth URL:', twitterAuthUrl);
      console.log('Twitter Client ID:', this.twitterClientId);
      console.log('Redirect URI:', this.redirectUri);
      console.log('Code Challenge:', codeChallenge);

      // Redirect to X (Twitter) OAuth
      window.location.href = twitterAuthUrl;
    } catch (error) {
      console.error('X sign-in error:', error);
      throw new Error('Failed to sign in with X');
    }
  }

  // Handle OAuth callbacks (for popup windows)
  async handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const state = urlParams.get('state');
    const errorDescription = urlParams.get('error_description');

    console.log('OAuth callback params:', { 
      code, 
      error, 
      state, 
      errorDescription,
      fullUrl: window.location.href,
      search: window.location.search
    });

    if (error) {
      console.error('OAuth error:', error, errorDescription);
      throw new Error(`${error}: ${errorDescription || 'Unknown error'}`);
    }

    if (code) {
      // Determine which provider based on state or URL
      const provider = this.detectProvider(state);
      console.log('Detected provider:', provider);
      
      if (provider === 'google') {
        console.log('Handling Google callback');
        await this.handleGoogleCallback(code);
      } else if (provider === 'github') {
        console.log('Handling GitHub callback');
        await this.handleGitHubCallback(code);
      } else if (provider === 'twitter') {
        console.log('Handling Twitter callback');
        await this.handleTwitterCallback(code);
      } else {
        console.error('Unknown OAuth provider:', provider);
        throw new Error('Unknown OAuth provider');
      }
    } else {
      console.error('No authorization code received');
      console.log('Available URL params:', Array.from(urlParams.entries()));
      throw new Error('No authorization code received');
    }
  }

  detectProvider(state) {
    // Check state parameter first, then localStorage
    if (state) {
      return state;
    }
    return localStorage.getItem('oauth_provider') || 'github';
  }

  async handleGoogleCallback(code) {
    try {
      console.log('Google callback: Starting API call with code:', code);
      console.log('API URL:', process.env.REACT_APP_API_URL);
      console.log('Redirect URI:', this.redirectUri);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          redirect_uri: this.redirectUri,
          provider: 'google'
        })
      });

      console.log('Google callback: Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google callback: HTTP error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Google callback: Response data:', data);
      
      if (data.success) {
        // Store authentication data
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('Google callback: Success, redirecting to dashboard');
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        throw new Error(data.message || data.error || 'Google authentication failed');
      }
    } catch (error) {
      console.error('Google callback error:', error);
      throw error; // Re-throw to be handled by the calling function
    }
  }

  async handleGitHubCallback(code) {
    try {
      console.log('GitHub callback: Starting API call with code:', code);
      console.log('API URL:', process.env.REACT_APP_API_URL);
      console.log('Redirect URI:', this.redirectUri);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          redirect_uri: this.redirectUri,
          provider: 'github'
        })
      });

      console.log('GitHub callback: Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('GitHub callback: HTTP error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('GitHub callback: Response data:', data);
      
      if (data.success) {
        // Store authentication data
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('GitHub callback: Success, redirecting to dashboard');
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        throw new Error(data.message || data.error || 'GitHub authentication failed');
      }
    } catch (error) {
      console.error('GitHub callback error:', error);
      throw error; // Re-throw to be handled by the calling function
    }
  }

  async handleTwitterCallback(code) {
    try {
      // Get the stored code verifier
      const codeVerifier = localStorage.getItem('twitter_code_verifier');
      console.log('Twitter callback: Starting API call with code:', code);
      console.log('Code verifier:', codeVerifier);
      console.log('API URL:', process.env.REACT_APP_API_URL);
      console.log('Redirect URI:', this.redirectUri);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          redirect_uri: this.redirectUri,
          provider: 'twitter',
          code_verifier: codeVerifier
        })
      });

      console.log('Twitter callback: Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Twitter callback: HTTP error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Twitter callback: Response data:', data);
      
      if (data.success) {
        // Store authentication data
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('Twitter callback: Success, redirecting to dashboard');
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        throw new Error(data.message || data.error || 'Twitter authentication failed');
      }
    } catch (error) {
      console.error('Twitter callback error:', error);
      throw error; // Re-throw to be handled by the calling function
    }
  }

  // PKCE helper methods for Twitter OAuth 2.0
  generateCodeVerifier() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  async generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
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

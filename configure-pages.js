// Script to configure Cloudflare Pages project via API
// This connects GitHub repository and configures build settings
// Uses Node.js built-in fetch (Node 18+)

const CF_API_TOKEN = process.env.CF_API_TOKEN || 'whNMUGwbY6UYL_6HOBrGJ3DCC1u4rbsfD_v3MrRY';
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID || '10374f367672f4d19db430601db0926b';
const PROJECT_NAME = 'blockchainvibe';
const GITHUB_OWNER = 'chiku524';
const GITHUB_REPO = 'blockchainvibe';
const PRODUCTION_BRANCH = 'main';

const API_BASE = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects/${PROJECT_NAME}`;

const headers = {
  'Authorization': `Bearer ${CF_API_TOKEN}`,
  'Content-Type': 'application/json'
};

async function configurePagesProject() {
  console.log('🚀 Configuring Cloudflare Pages project...\n');

  try {
    // Step 1: Get current project configuration
    console.log('📋 Fetching current project configuration...');
    const getResponse = await fetch(`${API_BASE}`, {
      method: 'GET',
      headers
    });

    if (!getResponse.ok) {
      const error = await getResponse.json();
      throw new Error(`Failed to fetch project: ${JSON.stringify(error)}`);
    }

    const project = await getResponse.json();
    console.log(`✅ Project found: ${project.result.name}\n`);

    // Step 2: Configure build settings and connect to GitHub
    console.log('🔧 Configuring build settings and GitHub connection...');
    
    // Update build configuration
    const buildConfig = {
      build_config: {
        build_command: 'npm run build:ci',
        destination_dir: 'build',
        root_dir: '.',
        web_analytics_tag: null,
        web_analytics_token: null
      }
    };

    console.log('📝 Updating build configuration...');
    const buildResponse = await fetch(`${API_BASE}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(buildConfig)
    });

    if (!buildResponse.ok) {
      const error = await buildResponse.json();
      console.error('❌ Build config error:', JSON.stringify(error, null, 2));
      throw new Error(`Failed to update build config: ${JSON.stringify(error)}`);
    }

    const buildResult = await buildResponse.json();
    
    if (buildResult.success) {
      console.log('✅ Build configuration updated!\n');
      console.log('📝 Current Configuration:');
      console.log(`   - Production branch: ${PRODUCTION_BRANCH}`);
      console.log(`   - Build command: npm run build:ci`);
      console.log(`   - Build output: build`);
      console.log(`   - Root directory: .`);
      console.log('\n⚠️  GitHub Connection:');
      console.log('   GitHub repository connection requires OAuth authorization.');
      console.log('   This must be done through the Cloudflare Dashboard:');
      console.log('   1. Go to: https://dash.cloudflare.com');
      console.log('   2. Navigate to: Pages → blockchainvibe → Settings → Builds & deployments');
      console.log('   3. Click "Connect to Git" and authorize GitHub');
      console.log('   4. Select repository: chiku524/blockchainvibe');
      console.log('\n✨ Alternative: Use wrangler.toml for configuration');
      console.log('   The wrangler.toml file has been configured.');
      console.log('   You can deploy directly using: wrangler pages deploy ./build');
      console.log(`\n🌐 Project URL: https://${PROJECT_NAME}.pages.dev`);
    } else {
      throw new Error(`Configuration failed: ${JSON.stringify(buildResult.errors)}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the configuration
configurePagesProject();


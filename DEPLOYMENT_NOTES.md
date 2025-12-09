# Deployment Notes

## Cloudflare Pages Configuration

### Important: Repository Name Change
If you renamed your repository from `ai-news-agent` to `blockchainvibe`, you must update your Cloudflare Pages project settings:

**The Issue**: Cloudflare Pages may fail to initialize the build environment if it's still connected to the old repository URL, even though GitHub redirects it.

**Solution Options**:

#### Option 1: Update Existing Project (Recommended if you can access settings)
1. **Go to Cloudflare Dashboard** → Pages → Your Project → Settings → Builds & deployments
2. **Update Repository Connection**:
   - Look for "Source" or "Connected repository" section
   - If there's an "Edit" or "Change" button, click it
   - Reconnect to: `https://github.com/chiku524/blockchainvibe`
   - If you can't edit, try disconnecting and reconnecting (see Option 2)

3. **Update Root Directory**:
   - In the same Settings → Builds & deployments section
   - Set **Root directory** to: `.` (or leave it blank/empty)
   - **DO NOT** set it to `blockchainvibe` - the codebase is now at the root

#### Option 2: Create New Cloudflare Pages Project (If you can't disconnect)
If you're unable to disconnect the old repository, create a new Cloudflare Pages project:

1. **Create New Project**:
   - Go to Cloudflare Dashboard → Pages → Create a project
   - Connect to Git → Select GitHub
   - Choose repository: `chiku524/blockchainvibe` (the new name)
   - Click "Begin setup"

2. **Configure Build Settings**:
   - **Framework preset**: Create React App (or None)
   - **Build command**: `npm run build:ci`
   - **Build output directory**: `build`
   - **Root directory**: `.` (or leave empty)

3. **Set Environment Variables**:
   - Add all your `REACT_APP_*` environment variables
   - Set `REACT_APP_API_URL` to your Worker URL

4. **Deploy**:
   - Click "Save and Deploy"
   - Once deployed, you can delete the old project

#### Option 3: Delete and Recreate (Recommended - CLI + Dashboard)
Since the project has too many deployments to delete via CLI, follow these steps:

**Step 1: Delete via Dashboard** (Required):
   - Go to Cloudflare Dashboard → Pages → `blockchainvibe` project
   - Go to Settings → General
   - Scroll down and click "Delete project"
   - Confirm deletion (this will remove all deployments and allow CLI deletion)

**Step 2: Create New Project via CLI** (After deletion):
   ```bash
   wrangler pages project create blockchainvibe --production-branch main
   ```

**Step 3: Connect to Git via Dashboard**:
   - Go to Cloudflare Dashboard → Pages → `blockchainvibe` project
   - Go to Settings → Builds & deployments
   - Click "Connect to Git"
   - Select GitHub and authorize
   - Choose repository: `chiku524/blockchainvibe` (the NEW repository name)
   - Click "Begin setup"

**Step 4: Configure Build Settings**:
   - **Build command**: `npm run build:ci`
   - **Build output directory**: `build`
   - **Root directory**: `.` (or leave empty) - **CRITICAL: Must be root, not `blockchainvibe`**
   - **Production branch**: `main`

**Step 5: Set Environment Variables**:
   - Add all your `REACT_APP_*` environment variables
   - Set `REACT_APP_API_URL` to your Worker URL

**Step 6: Save and Deploy**:
   - Click "Save and Deploy"
   - The build should now work with the correct repository connection

#### Option 4: Update Git Remote (Already done locally)
The local git remote has been updated to point to the new repository URL.

### Build Settings
- **Build command**: `npm run build:ci` (uses CI=true to treat warnings as errors)
- **Build output directory**: `build`
- **Root directory**: `.` (root of repository) - **MUST be set to `.` or left empty**

### Environment Variables
Cloudflare Pages automatically sets `CI=true` which causes react-scripts to treat ESLint warnings as errors.

### ESLint Configuration
The ESLint config has been updated to be more lenient with unused variables:
- Unused vars starting with `_` are allowed (for intentionally unused variables)
- Empty destructuring patterns are now warnings instead of errors
- Rest siblings are ignored in unused var checks

### Preventing Build Failures

1. **Before committing**: Always run `npm run build` locally to catch errors early
2. **Unused imports**: Remove unused imports and variables before committing
3. **Intentionally unused vars**: Prefix with `_` (e.g., `const { _unused } = data;`)
4. **Empty patterns**: Avoid empty destructuring `const { } = data;` - use `const _data = data;` instead

### Local Build vs CI Build
- `npm run build` - Sets CI=false (warnings don't fail build) - use for local testing
- `npm run build:ci` - Uses CI=true (warnings fail build) - matches Cloudflare Pages behavior

### Quick Check
Before pushing to GitHub, always run:
```bash
npm run build:ci
```

This will simulate the exact build environment on Cloudflare Pages.


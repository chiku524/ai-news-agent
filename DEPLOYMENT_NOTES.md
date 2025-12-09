# Deployment Notes

## Cloudflare Pages Configuration

### Build Settings
- **Build command**: `npm run build:ci` (uses CI=true to treat warnings as errors)
- **Build output directory**: `build`
- **Root directory**: `blockchainvibe`

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


# Google Maps API Key Setup

## Environment Variables Setup

### 1. Create .env file

Create a `.env` file in the root directory with your Google Maps API key:

```bash
GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 2. Install dependencies

```bash
npm install dotenv
```

### 3. Local Development

The `.env` file is already in `.gitignore`, so it won't be committed to the repository.

### 4. Production Deployment

#### For GitHub Actions (AWS S3):

Add the environment variable to your GitHub repository secrets:

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `GOOGLE_MAPS_API_KEY`
5. Value: Your actual Google Maps API key

#### Update GitHub Actions workflow:

Add the environment variable to your deploy workflow:

```yaml
- name: Build site (Tailwind CSS + Hexo)
  run: npm run build
  env:
    GOOGLE_MAPS_API_KEY: ${{ secrets.GOOGLE_MAPS_API_KEY }}
```

### 5. Security Notes

- ✅ API key is no longer exposed in the repository
- ✅ Environment variables are used for configuration
- ✅ `.env` file is in `.gitignore`
- ✅ Helper function provides fallback for missing keys

### 6. Testing

To test locally:

1. Create `.env` file with your API key
2. Run `npm run build`
3. Check that maps work on suburb pages

### 7. Troubleshooting

If maps don't work:

1. Check that `.env` file exists and has the correct API key
2. Verify the API key has proper domain restrictions in Google Cloud Console
3. Ensure billing is enabled for the Google Maps API
4. Check browser console for any JavaScript errors

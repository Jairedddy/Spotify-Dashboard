# Spotify API Setup Instructions

## The Issue
You're getting the `unsupported_response_type` error because the Spotify Client ID is not configured.

## Solution

1. **Create a Spotify App:**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications)
   - Click "Create App"
   - Fill in the app details:
     - App name: "Spotify Dashboard" (or any name you prefer)
     - App description: "Spotify data visualization dashboard"
   - Click "Create"

2. **Configure App Settings:**
   - In your app settings, add `http://127.0.0.1:3000` to the "Redirect URIs"
   - Copy your "Client ID"

3. **Create Environment File:**
   - Create a file named `.env` in the `spotify-dashboard` directory
   - Add the following content:
   ```
   REACT_APP_SPOTIFY_CLIENT_ID=your_actual_client_id_here
   REACT_APP_SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000
   ```
   - Replace `your_actual_client_id_here` with the Client ID you copied from Spotify

4. **Restart the Application:**
   - Stop your current development server (Ctrl+C)
   - Run `npm start` again

## Important Notes
- Never commit your `.env` file to version control
- The `.env` file should be in the `spotify-dashboard` directory (same level as `package.json`)
- Make sure there are no spaces around the `=` sign in the `.env` file

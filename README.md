# 🎵 Spotify Dashboard

A comprehensive, interactive dashboard for visualizing your Spotify listening data with beautiful, data-driven insights and analytics.

![Spotify Dashboard](https://img.shields.io/badge/React-19.1.1-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![Spotify API](https://img.shields.io/badge/Spotify-API-1db954)

> Live App: https://spotify-dashbored.netlify.app/

## [Application link](https://spotify-dashbored.netlify.app/)

## ✨ Features

### 🎯 Core Modules
- **📊 Dashboard** - Overview of your top artists, recent tracks, and quick insights
- **📈 Music Stats** - Detailed analytics including popularity trends, decade distribution, and artist diversity
- **⏰ Timeline** - Chronological view of your recent listening history with interactive track details
- **🖼️ Collage** - Visual album artwork grid of your top tracks
- **🧬 Playlist DNA** - Analyze the musical characteristics and patterns in your playlists
- **🌊 Moodscape** - Interactive mood visualization based on track features and listening patterns

### 🎨 Design Features
- **Dark/Light Theme Toggle** - Seamless theme switching with persistent preferences
- **Responsive Design** - Optimized for desktop and mobile viewing
- **Modern UI/UX** - Clean, intuitive interface with smooth animations
- **Real-time Data** - Live Spotify API integration with refresh capabilities

### 🔐 Authentication & Security
- **Spotify OAuth 2.0** - Secure authentication flow
- **Token Management** - Automatic token refresh and storage
- **Privacy Focused** - No data stored on external servers

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Spotify Developer Account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spotify-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Spotify App**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications)
   - Create a new app
   - Add `http://127.0.0.1:3000` to Redirect URIs
   - Copy your Client ID

4. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
   REACT_APP_SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000
   REACT_APP_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
   ```

5. **Start the application**
   ```bash
   npm start
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
spotify-dashboard/
├── public/                 # Static assets
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── Loader.js
│   │   ├── Navbar.js
│   │   ├── Sidebar.js
│   │   └── ThemeToggle.js
│   ├── context/           # React Context providers
│   │   ├── AuthContext.js
│   │   ├── ThemeContext.js
│   │   └── UserDataContext.js
│   ├── modules/           # Feature modules
│   │   ├── Collage/
│   │   ├── Moodscape/
│   │   ├── PlaylistDNA/
│   │   ├── Rituals/
│   │   ├── Stats/
│   │   └── Timeline/
│   ├── pages/             # Main application pages
│   │   ├── Dashboard.js
│   │   ├── Login.js
│   │   └── Profile.js
│   ├── styles/            # Global styles and themes
│   │   ├── globals.css
│   │   └── theme.css
│   ├── utils/             # Utility functions
│   │   ├── format.js
│   │   └── spotify.js
│   ├── App.js             # Main application component
│   └── index.js           # Application entry point
├── package.json
├── SPOTIFY_SETUP.md       # Detailed Spotify setup instructions
└── README_1.md           # This file
```

## 🎵 Spotify API Integration

### Required Scopes
The application requests the following Spotify API scopes:
- `user-read-private` - Access to user's profile information
- `user-read-email` - Access to user's email address
- `user-top-read` - Access to user's top tracks and artists
- `user-read-recently-played` - Access to recently played tracks
- `playlist-read-private` - Access to user's private playlists
- `user-library-read` - Access to user's saved tracks and albums
- `user-follow-read` - Access to user's followed artists

### API Endpoints Used
- `/me` - User profile information
- `/me/top/tracks` - User's top tracks
- `/me/top/artists` - User's top artists
- `/me/player/recently-played` - Recently played tracks
- `/me/playlists` - User's playlists
- `/audio-features/{id}` - Track audio features

## 🛠️ Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Development Workflow

1. **For development and testing changes:**
   ```bash
   npm run dev
   ```

2. **For production builds:**
   ```bash
   npm run build
   ```

### Code Style
- Uses modern React hooks and functional components
- Implements React Context for state management
- Follows component-based architecture
- Uses CSS custom properties for theming

## 🎨 Theming

The application supports both dark and light themes with:
- CSS custom properties for consistent theming
- Smooth transitions between themes
- Persistent theme preferences
- Spotify-inspired color palette

### Theme Variables
```css
:root {
  --background: #f3f4f6;
  --surface: #fff;
  --primary: #1db954;    /* Spotify Green */
  --accent: #3b82f6;     /* Blue accent */
  --text: #18181b;
  --muted: #6b7280;
  --border: #e5e7eb;
}
```

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_SPOTIFY_CLIENT_ID` | Spotify App Client ID | Yes |
| `REACT_APP_SPOTIFY_REDIRECT_URI` | OAuth redirect URI | Yes |
| `REACT_APP_SPOTIFY_CLIENT_SECRET` | Spotify App Client Secret | Yes |

### Customization

You can customize the application by:
- Modifying theme colors in `src/styles/globals.css`
- Adding new modules in `src/modules/`
- Extending the sidebar navigation in `src/components/Sidebar.js`
- Customizing the dashboard layout in `src/pages/Dashboard.js`

## 🚨 Troubleshooting

### Common Issues

1. **"unsupported_response_type" error**
   - Ensure your Spotify Client ID is correctly set in `.env`
   - Verify the redirect URI matches your Spotify app settings

2. **Authentication fails**
   - Check that all required scopes are enabled in your Spotify app
   - Ensure the redirect URI is exactly `http://127.0.0.1:3000`

3. **API rate limits**
   - The app implements proper error handling for rate limits
   - Consider implementing caching for frequently accessed data

### Debug Mode
Enable debug logging by opening browser developer tools and checking the console for detailed API request information.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) for providing the data
- [React](https://reactjs.org/) for the amazing framework
- [Create React App](https://create-react-app.dev/) for the development setup

## 📞 Support

If you encounter any issues or have questions:
1. Check the [SPOTIFY_SETUP.md](SPOTIFY_SETUP.md) for detailed setup instructions
2. Review the troubleshooting section above
3. Open an issue on GitHub

---

**Made with ❤️ and 🎵 for music lovers everywhere**

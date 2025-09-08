const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:3000';
const SCOPES = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-read-recently-played',
    'playlist-read-private',
    'user-library-read',
    'user-follow-read',
];

export function getAuthUrl() {
    console.log('CLIENT_ID:', CLIENT_ID);
    console.log('REDIRECT_URI:', REDIRECT_URI);
    
    if (!CLIENT_ID) {
        console.error('REACT_APP_SPOTIFY_CLIENT_ID is not set. Please create a .env file with your Spotify app credentials.');
        alert('Spotify Client ID is not configured. Please check your environment variables.');
        return '#';
    }
    
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        scope: SCOPES.join(' '),
        show_dialog: 'true',
    });
    
    const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
    console.log('Generated auth URL:', authUrl);
    return authUrl;
}

export function getCodeFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('code');
}

export async function exchangeCodeForToken(code) {
    const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
    
    if (!CLIENT_SECRET) {
        throw new Error('REACT_APP_SPOTIFY_CLIENT_SECRET is not set');
    }
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        })
    });
    
    if (!response.ok) {
        throw new Error('Failed to exchange code for token');
    }
    
    const data = await response.json();
    return data.access_token;
}

export async function fetchSpotify(endpoint, token, params = {}) {
    const url = new URL(`https://api.spotify.com/v1/${endpoint}`);
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
    
    console.log('Making Spotify API request to:', url.toString());
    
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Spotify API error:', {
            status: res.status,
            statusText: res.statusText,
            endpoint,
            error: errorData
        });
        throw new Error(`Spotify API error: ${res.status} ${res.statusText}`);
    }
    
    return res.json();
}
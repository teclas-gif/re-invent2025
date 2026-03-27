require('dotenv').config();
const axios = require('axios');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

console.log('Testing Spotify Credentials...\n');
console.log('Client ID:', CLIENT_ID);
console.log('Client Secret:', '***' + CLIENT_SECRET.slice(-4));

// Test if credentials work with client credentials flow
async function testCredentials() {
    try {
        const authString = Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64');
        
        const response = await axios.post('https://accounts.spotify.com/api/token',
            'grant_type=client_credentials',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + authString
                }
            }
        );
        
        console.log('\n✅ SUCCESS! Credentials are valid.');
        console.log('Access token received:', response.data.access_token.substring(0, 20) + '...');
        console.log('\nThe INVALID_CLIENT error is likely due to:');
        console.log('1. Missing redirect URI in Spotify Dashboard');
        console.log('2. Redirect URI must be EXACTLY: http://127.0.0.1:3000/callback');
        console.log('\nGo to: https://developer.spotify.com/dashboard');
        console.log('Click your app → Edit Settings → Add the redirect URI above');
        
    } catch (error) {
        console.log('\n❌ ERROR! Credentials are invalid.');
        console.log('Error:', error.response?.data || error.message);
        console.log('\nPlease double-check your Client ID and Client Secret');
    }
}

testCredentials();

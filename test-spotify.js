const dotenv = require('dotenv');
dotenv.config();

console.log('Testing Spotify Credentials...\n');
console.log('Client ID:', process.env.SPOTIFY_CLIENT_ID);
console.log('Client Secret:', process.env.SPOTIFY_CLIENT_SECRET ? '***' + process.env.SPOTIFY_CLIENT_SECRET.slice(-4) : 'MISSING');
console.log('\nRedirect URI should be: http://127.0.0.1:3000/callback');
console.log('\nIf credentials look correct, check your Spotify Dashboard:');
console.log('1. Go to https://developer.spotify.com/dashboard');
console.log('2. Click on your app');
console.log('3. Click "Edit Settings"');
console.log('4. Add redirect URI: http://127.0.0.1:3000/callback');
console.log('5. Click "Save"');

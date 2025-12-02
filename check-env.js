require('dotenv').config();

console.log('Environment Variables Check:\n');
console.log('SPOTIFY_CLIENT_ID:', process.env.SPOTIFY_CLIENT_ID || 'NOT SET');
console.log('SPOTIFY_CLIENT_SECRET:', process.env.SPOTIFY_CLIENT_SECRET ? 'SET (***' + process.env.SPOTIFY_CLIENT_SECRET.slice(-4) + ')' : 'NOT SET');
console.log('ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? 'SET' : 'NOT SET');
console.log('USE_MCP:', process.env.USE_MCP || 'NOT SET');
console.log('\nIf any are "NOT SET", check your .env file');

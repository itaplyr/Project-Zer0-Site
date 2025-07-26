import fetch from 'node-fetch';

export async function handler(event, context) {
  const clientId = '1395848486359924756';
  // Use environment variables for client secret and redirect URI
  const clientSecret = process.env.DISCORD_CLIENT_SECRET || 'XqENTxEf1EDQGrs56-t-540M6WErd4w_';
  const redirectUri = process.env.REDIRECT_URI || 'https://project-zer0-official.netlify.app/';

  const code = event.queryStringParameters.code;

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing code parameter' }),
    };
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        scope: 'identify',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error('Failed to get access token:', tokenData);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Failed to get access token', details: tokenData }),
      };
    }

    // Use access token to get user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userData.id) {
      console.error('Failed to get user info:', userData);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Failed to get user info', details: userData }),
      };
    }

    // Return user info to frontend
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: userData.id,
        username: userData.username,
        discriminator: userData.discriminator,
        avatar: userData.avatar,
      }),
    };
  } catch (error) {
    console.error('Internal server error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
}

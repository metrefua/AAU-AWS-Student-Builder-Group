export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || 'your-auth0-domain.auth0.com',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || 'your-auth0-client-id',
  redirectUri: 'https://aws-aau-club-student-hub.vercel.app/',
  audience: import.meta.env.VITE_AUTH0_AUDIENCE || 'your-auth0-audience'
};

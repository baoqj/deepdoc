import { NextResponse } from 'next/server';

// This is your Next.js API route for handling Google OAuth callback
// It should match the Redirect URI configured in Google Cloud Console and your backend config
// e.g., http://localhost:3000/api/auth/callback/google

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  
  if (!code) {
    // Handle the case where code is not present (e.g., user denied access)
    return NextResponse.redirect('http://localhost:3000/login?error=access_denied');
  }

  try {
    // Forward the code to your Python backend to exchange for a token and get user info
    // Make sure the backend is running and accessible at http://localhost:8000
    const backend_auth_url = "http://localhost:8000/api/v1/auth/google"; // Updated backend endpoint
    
    const resp = await fetch(backend_auth_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    
    if (!resp.ok) {
      // Handle errors from the backend
      const errorData = await resp.json();
      console.error('Backend authentication failed:', errorData);
      return NextResponse.redirect(`http://localhost:3000/login?error=backend_auth_failed&details=${errorData.detail || resp.statusText}`);
    }
    
    const data = await resp.json(); // data now contains { access_token, token_type, user }

    // Login successful, redirect to /doc and pass token and user info
    if (data.access_token && data.user) { // Check for both token and user data
      const redirectUrl = new URL('http://localhost:3000/doc'); // Redirect to /doc page
      redirectUrl.searchParams.set('token', data.access_token);
      // Pass user info as query parameters (simple approach, consider other methods for larger data)
      if (data.user.name) redirectUrl.searchParams.set('userName', data.user.name);
      if (data.user.picture) redirectUrl.searchParams.set('userPicture', data.user.picture);
      // You might also pass email or user ID if needed

      return NextResponse.redirect(redirectUrl.toString());
    } else {
      // Backend did not return expected data
       console.error('Backend authentication successful but missing token or user data:', data);
       return NextResponse.redirect('http://localhost:3000/login?error=missing_auth_data');
    }

  } catch (error) {
    console.error('Error during Google OAuth callback:', error);
    return NextResponse.redirect(`http://localhost:3000/login?error=internal_error&details=${(error as Error).message}`);
  }
}
 
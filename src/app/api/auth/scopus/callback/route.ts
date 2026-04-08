import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL('/dashboard?error=scopus_auth_failed', req.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/dashboard?error=no_code_provided', req.url));
  }

  // 3. Token Exchange (Mocked for now since we don't have real Elsevier credentials)
  // In production, this would make a POST request to https://auth.data.mendeley.com/oauth2/token
  // using the `code`, `client_id`, `client_secret`, and `redirect_uri`

  console.log("Received Scopus OAuth code:", code);

  // Set mock token in cookies or session for the authenticated querying phase
  const response = NextResponse.redirect(new URL('/dashboard?scopus=authenticated', req.url));
  response.cookies.set('scopus_access_token', 'mock_inst_token_or_access_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

  return response;
}
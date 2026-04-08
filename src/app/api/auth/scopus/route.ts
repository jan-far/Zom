import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // 1. Authorization Initiation
  const clientId = process.env.SCOPUS_CLIENT_ID || "mock-client-id";
  const redirectUri = process.env.NEXT_PUBLIC_URL ? `${process.env.NEXT_PUBLIC_URL}/api/auth/scopus/callback` : "http://localhost:3000/api/auth/scopus/callback";

  // Scopus/Mendeley OAuth2 Endpoint
  const authUrl = `https://auth.data.mendeley.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20profile%20email&state=scopus_auth_request`;

  return NextResponse.redirect(authUrl);
}

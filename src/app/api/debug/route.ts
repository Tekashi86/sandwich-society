import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const SHEET_ID = process.env.GOOGLE_SHEET_ID;
    const EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

    return NextResponse.json({
      status: 'Environment Variables Check',
      SHEET_ID: SHEET_ID ? 'Set ✅' : 'Missing ❌',
      EMAIL: EMAIL ? 'Set ✅' : 'Missing ❌',
      PRIVATE_KEY: PRIVATE_KEY ? 'Set ✅' : 'Missing ❌',
      SHEET_ID_value: SHEET_ID || 'Not found',
      EMAIL_value: EMAIL || 'Not found',
      PRIVATE_KEY_length: PRIVATE_KEY ? PRIVATE_KEY.length : 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      status: 'Error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

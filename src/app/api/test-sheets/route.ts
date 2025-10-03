import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  try {
    // Google Sheets configuration
    const SHEET_ID = process.env.GOOGLE_SHEET_ID;
    const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    console.log('Environment variables check:');
    console.log('SHEET_ID:', SHEET_ID ? 'Set' : 'Missing');
    console.log('EMAIL:', GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'Set' : 'Missing');
    console.log('PRIVATE_KEY:', GOOGLE_PRIVATE_KEY ? 'Set (length: ' + GOOGLE_PRIVATE_KEY.length + ')' : 'Missing');

    if (!SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      return NextResponse.json({
        error: 'Missing environment variables',
        details: {
          SHEET_ID: !!SHEET_ID,
          EMAIL: !!GOOGLE_SERVICE_ACCOUNT_EMAIL,
          PRIVATE_KEY: !!GOOGLE_PRIVATE_KEY
        }
      }, { status: 500 });
    }

    // Set up Google Sheets API authentication
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Test basic connection - just get sheet info
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });

    return NextResponse.json({
      success: true,
      sheetTitle: response.data.properties?.title,
      message: 'Google Sheets API connection successful!'
    });

  } catch (error) {
    console.error('Google Sheets test error:', error);

    return NextResponse.json({
      error: 'Google Sheets connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : 'Unknown'
    }, { status: 500 });
  }
}

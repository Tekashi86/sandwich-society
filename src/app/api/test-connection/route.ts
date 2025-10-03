import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  try {
    // Step 1: Get environment variables
    const SHEET_ID = process.env.GOOGLE_SHEET_ID;
    const EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    console.log('Step 1: Environment variables loaded');

    if (!SHEET_ID || !EMAIL || !PRIVATE_KEY) {
      return NextResponse.json({
        error: 'Missing environment variables',
        step: 1
      }, { status: 500 });
    }

    // Step 2: Create Google Auth
    console.log('Step 2: Creating Google Auth...');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: EMAIL,
        private_key: PRIVATE_KEY,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    console.log('Step 3: Getting auth client...');
    const authClient = await auth.getClient();

    console.log('Step 4: Creating sheets client...');
    const sheets = google.sheets({ version: 'v4', auth });

    console.log('Step 5: Testing basic sheet access...');

    // First try to get sheet metadata
    const sheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });

    console.log('Step 6: Getting sheet values...');

    // Then try to get the actual data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Main!A:C',
    });

    return NextResponse.json({
      success: true,
      step: 'All steps completed',
      sheetTitle: sheetInfo.data.properties?.title,
      rowCount: response.data.values?.length || 0,
      firstRow: response.data.values?.[0] || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Google Sheets test error:', error);

    return NextResponse.json({
      error: 'Google Sheets API Error',
      details: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.constructor.name : 'Unknown',
      stack: error instanceof Error ? error.stack?.substring(0, 500) : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Google Sheets configuration
    const SHEET_ID = process.env.GOOGLE_SHEET_ID;
    const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      return NextResponse.json(
        { error: 'Google Sheets configuration missing. Please set up environment variables.' },
        { status: 500 }
      );
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

    // Fetch LIVE data from the sheet - updates automatically when sheet changes
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Main!A:C', // Gets all data from columns A, B, C
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'No data found in the sheet' },
        { status: 404 }
      );
    }

    // Find the user in the sheet (case-insensitive search)
    const userRow = rows.find((row, index) => {
      // Skip header row (index 0)
      if (index === 0) return false;

      const sheetUsername = row[0]?.toString().toLowerCase().trim();
      const searchUsername = username.toLowerCase().trim();
      return sheetUsername === searchUsername;
    });

    if (!userRow) {
      // Get all available usernames for debugging
      const availableUsers = rows.slice(1) // Skip header
        .filter(row => row[0] && row[0].toString().trim()) // Only non-empty usernames
        .map(row => row[0].toString().trim())
        .join(', ');

      return NextResponse.json(
        {
          error: 'Username not found. Please check your username or contact support.',
          availableUsers: availableUsers || 'No users found'
        },
        { status: 404 }
      );
    }

    // Extract points data (columns: Username, All-Time Points, Weekly Points)
    const allTimePoints = parseInt(userRow[1]?.toString() || '0') || 0;
    const weeklyPoints = parseInt(userRow[2]?.toString() || '0') || 0;

    // Set maximum values
    const maxAllTime = 100;
    const maxWeekly = 100;

    return NextResponse.json({
      username: userRow[0],
      allTime: allTimePoints,
      weekly: weeklyPoints,
      maxAllTime,
      maxWeekly,
      success: true
    });

  } catch (error) {
    console.error('Error fetching points:', error);

    // Handle specific Google API errors
    if (error instanceof Error) {
      if (error.message.includes('PERMISSION_DENIED')) {
        return NextResponse.json(
          { error: 'Permission denied. Please check Google Sheets sharing permissions.' },
          { status: 403 }
        );
      }
      if (error.message.includes('INVALID_ARGUMENT')) {
        return NextResponse.json(
          { error: 'Invalid sheet ID or range. Please check your configuration.' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch points data. Please try again later.' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test 1: Can we import googleapis?
    console.log('Step 1: Testing googleapis import...');
    const { google } = await import('googleapis');
    console.log('Step 1: ✅ googleapis imported successfully');

    // Test 2: Can we access environment variables?
    console.log('Step 2: Testing environment variables...');
    const SHEET_ID = process.env.GOOGLE_SHEET_ID;
    const EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

    console.log('Environment variables check:', {
      SHEET_ID: !!SHEET_ID,
      EMAIL: !!EMAIL,
      PRIVATE_KEY: !!PRIVATE_KEY,
      SHEET_ID_VALUE: SHEET_ID,
      EMAIL_VALUE: EMAIL
    });

    if (!SHEET_ID || !EMAIL || !PRIVATE_KEY) {
      return NextResponse.json({
        error: 'Missing environment variables',
        details: {
          SHEET_ID: !!SHEET_ID,
          EMAIL: !!EMAIL,
          PRIVATE_KEY: !!PRIVATE_KEY
        }
      });
    }

    // Test 3: Can we create GoogleAuth object?
    console.log('Step 3: Testing GoogleAuth creation...');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: EMAIL,
        private_key: PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    console.log('Step 3: ✅ GoogleAuth created');

    // Test 4: Can we get auth client?
    console.log('Step 4: Testing auth client...');
    const authClient = await auth.getClient();
    console.log('Step 4: ✅ Auth client obtained');

    return NextResponse.json({
      success: true,
      message: 'All basic tests passed!',
      tests: {
        googleapis_import: '✅',
        environment_variables: '✅',
        google_auth_creation: '✅',
        auth_client: '✅'
      }
    });

  } catch (error) {
    console.error('Test failed at step:', error);

    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

import { getSheetData } from '@/lib/google-sheets';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const spreadsheetId = searchParams.get('spreadsheetId');
    const range = searchParams.get('range');

    if (!spreadsheetId || !range) {
      return NextResponse.json(
        { error: 'spreadsheetId and range are required' },
        { status: 400 }
      );
    }

    const data = await getSheetData(spreadsheetId, range);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in GET /api/sheets/get:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sheet data' },
      { status: 500 }
    );
  }
} 
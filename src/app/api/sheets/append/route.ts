import { appendSheetData } from '@/lib/google-sheets';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { spreadsheetId, range, values } = body;

    if (!spreadsheetId || !range || !values) {
      return NextResponse.json(
        { error: 'spreadsheetId, range, and values are required' },
        { status: 400 }
      );
    }

    const result = await appendSheetData(spreadsheetId, range, values);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error in POST /api/sheets/append:', error);
    return NextResponse.json(
      { error: 'Failed to append sheet data' },
      { status: 500 }
    );
  }
} 
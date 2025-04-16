import { deleteSheetRow } from '@/lib/google-sheets';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { spreadsheetId, sheetId, rowIndex } = body;

    if (!spreadsheetId || sheetId === undefined || rowIndex === undefined) {
      return NextResponse.json(
        { error: 'spreadsheetId, sheetId, and rowIndex are required' },
        { status: 400 }
      );
    }

    const result = await deleteSheetRow(spreadsheetId, sheetId, rowIndex);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error in POST /api/sheets/delete:', error);
    return NextResponse.json(
      { error: 'Failed to delete sheet row' },
      { status: 500 }
    );
  }
} 
import { google } from 'googleapis';

// Verifica se as variáveis de ambiente estão definidas
if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL || !process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
  throw new Error('GOOGLE_SHEETS_CLIENT_EMAIL e GOOGLE_SHEETS_PRIVATE_KEY são necessários no arquivo .env');
}

// Log para debug (remova em produção)
console.log('Client Email:', process.env.GOOGLE_SHEETS_CLIENT_EMAIL);
console.log('Private Key length:', process.env.GOOGLE_SHEETS_PRIVATE_KEY?.length);

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export const getSheetData = async (spreadsheetId: string, range: string) => {
  try {
    console.log('Tentando acessar a planilha:', spreadsheetId);
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    return response.data.values;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
};

export const updateSheetData = async (
  spreadsheetId: string,
  range: string,
  values: any[][]
) => {
  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating sheet data:', error);
    throw error;
  }
};

export const appendSheetData = async (
  spreadsheetId: string,
  range: string,
  values: any[][]
) => {
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error appending sheet data:', error);
    throw error;
  }
};

export const deleteSheetRow = async (
  spreadsheetId: string,
  sheetId: number,
  rowIndex: number
) => {
  try {
    const response = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: 'ROWS',
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting sheet row:', error);
    throw error;
  }
}; 
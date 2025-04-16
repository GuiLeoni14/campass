"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle } from "lucide-react";

export default function GoogleSheetsManager() {
  const [spreadsheetUrl, setSpreadsheetUrl] = useState("");
  const [sheetData, setSheetData] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const extractSpreadsheetId = (url: string) => {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  const fetchSheetData = async () => {
    setLoading(true);
    setError("");
    try {
      const spreadsheetId = extractSpreadsheetId(spreadsheetUrl);
      if (!spreadsheetId) {
        setError("URL inválida. Por favor, insira um link válido do Google Sheets.");
        return;
      }

      const response = await fetch(
        `/api/sheets/get?spreadsheetId=${spreadsheetId}&range=A1:Z1000`
      );
      
      if (!response.ok) {
        console.log(response);
        throw new Error("Falha ao buscar dados da planilha. Verifique se a planilha foi compartilhada com a conta de serviço.");
      }

      const data = await response.json();
      setSheetData(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar dados");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={spreadsheetUrl}
            onChange={(e) => setSpreadsheetUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/..."
            className="flex-1"
          />
          <Button
            onClick={fetchSheetData}
            disabled={loading || !spreadsheetUrl}
          >
            {loading ? "Carregando..." : "Buscar Dados"}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Alert>
          <AlertTitle className="text-sm font-medium">Antes de usar:</AlertTitle>
          <AlertDescription className="mt-2">
            <ol className="list-decimal list-inside space-y-1">
              <li>Compartilhe sua planilha com o email da conta de serviço campass@next-auth-357020.iam.gserviceaccount.com</li>
              <li>Dê permissão de "Editor" para a conta de serviço</li>
              <li>Cole o link da planilha no campo acima</li>
            </ol>
          </AlertDescription>
        </Alert>
      </div>

      {sheetData.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {sheetData[0].map((header: string, index: number) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sheetData.slice(1).map((row: any[], rowIndex: number) => (
                <TableRow key={rowIndex}>
                  {row.map((cell: any, cellIndex: number) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 
'use client';

// Minimal, valid .xlsx generator built on JSZip (a transitive dependency of next).
// Creates a proper SpreadsheetML workbook from an array of rows.

interface Cell {
  v: string | number;
  t?: "s" | "n";
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function colName(index: number): string {
  let s = "";
  let n = index + 1;
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function sheetXml(rows: Cell[][], sheetName: string): string {
  const ref = `${colName(0)}1:${colName(Math.max(rows[0]?.length || 1, 1) - 1)}${rows.length}`;
  const sheetData = rows
    .map((row, r) => {
      const cells = row
        .map((cell, c) => {
          const t = cell.t === "n" ? ` t="n"` : ` t="s"`;
          const value =
            cell.t === "n"
              ? `<v>${String(cell.v)}</v>`
              : `<v>${escapeXml(String(cell.v))}</v>`;
          return `<c r="${colName(c) + (r + 1)}"${t}>${value}</c>`;
        })
        .join("");
      return `<row r="${r + 1}">${cells}</row>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"/></sheetViews><sheetFormatPr defaultRowHeight="15"/><sheetData>${sheetData}</sheetData></worksheet>`;
}

function sharedStringsXml(strings: string[]): string {
  const items = strings.map((s) => `<si><t xml:space="preserve">${escapeXml(s)}</t></si>`).join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${strings.length}" uniqueCount="${strings.length}">${items}</sst>`;
}

function workbookXml(sheetName: string): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${escapeXml(sheetName)}" sheetId="1" r:id="rId1"/></sheets></workbook>`;
}

function relsXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;
}

function workbookRelsXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/></Relationships>`;
}

function contentTypeXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/></Types>`;
}

export async function rowsToXlsxBlob(
  rows: (string | number)[][],
  sheetName = "Sheet1"
): Promise<Blob> {
  const { default: JSZip } = await import("jszip");

  // Map cells to shared strings and numbers.
  const strings: string[] = [];
  const stringIndex = new Map<string, number>();
  const cells: Cell[][] = rows.map((row) =>
    row.map((val) => {
      if (typeof val === "number") {
        return { v: val, t: "n" as const };
      }
      let idx = stringIndex.get(val);
      if (idx === undefined) {
        idx = strings.length;
        stringIndex.set(val, idx);
        strings.push(val);
      }
      return { v: idx, t: "s" as const };
    })
  );

  const zip = new JSZip();
  zip.file("[Content_Types].xml", contentTypeXml());
  zip.file("_rels/.rels", relsXml());
  zip.folder("xl")!.file("workbook.xml", workbookXml(sheetName));
  zip.folder("xl/_rels")!.file("workbook.xml.rels", workbookRelsXml());
  zip.folder("xl/worksheets")!.file("sheet1.xml", sheetXml(cells, sheetName));
  zip.folder("xl")!.file("sharedStrings.xml", sharedStringsXml(strings));

  const buffer = await zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  return buffer as Blob;
}

export function downloadXlsx(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

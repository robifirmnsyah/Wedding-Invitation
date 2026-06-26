/**
 * Minimal, dependency-free CSV helpers (RFC 4180-ish).
 * Used by the admin guest list export (client) and bulk import (server).
 */

/** Escape a single field: quote it when it contains a comma, quote, or newline. */
function escapeField(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Serialize a 2D array of strings into a CSV string (CRLF line endings). */
export function toCsv(rows: string[][]): string {
  return rows.map((row) => row.map((f) => escapeField(f ?? "")).join(",")).join("\r\n");
}

/**
 * Parse a CSV string into a 2D array of strings.
 * Handles quoted fields, escaped quotes (""), commas and newlines inside quotes,
 * and both LF and CRLF line endings. Skips a trailing empty line.
 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  let i = 0;

  // Strip a leading UTF-8 BOM if present (Excel adds one).
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  while (i < text.length) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += char;
      i++;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (char === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (char === "\r") {
      // Swallow CR; the following LF (if any) finalizes the row.
      i++;
      continue;
    }
    if (char === "\n") {
      row.push(field);
      rows.push(row);
      field = "";
      row = [];
      i++;
      continue;
    }
    field += char;
    i++;
  }

  // Flush the last field/row if the file doesn't end with a newline.
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // Drop fully-empty trailing rows (e.g. blank line at end of file).
  return rows.filter((r) => !(r.length === 1 && r[0].trim() === ""));
}

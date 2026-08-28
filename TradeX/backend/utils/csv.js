/**
 * ============================================================================
 * CSV Utility Module (csv.js)
 * ============================================================================
 * Purpose:
 *   Converts JSON datasets (Holdings, Orders, Trade Analytics) into formatted CSV strings
 *   for browser download or data ingestion pipelines (e.g. Power BI, Excel).
 *
 * Key Functionalities:
 *   - escapeCell: Escapes quotes, commas, and linebreaks conforming to RFC-4180 CSV standard.
 *   - toCsv: Serializes an array of JavaScript objects into CSV format with header row.
 * ============================================================================
 */

/**
 * Escapes values containing commas, double quotes, or newlines by wrapping them
 * in double quotes and escaping internal quotes as `""`.
 *
 * @param {*} value - The cell value to format
 * @returns {string} - Escaped CSV cell string
 */
const escapeCell = (value) => {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

/**
 * Converts an array of objects into a standard CSV string.
 *
 * @param {Array<Object>} rows - Array of records/objects to export
 * @param {Array<string>} [columns] - Optional specific column headers to include
 * @returns {string} - Formatted CSV document string
 */
const toCsv = (rows, columns) => {
  if (!rows.length) return columns ? columns.join(",") : "";
  const headers = columns || Object.keys(rows[0]);
  const lines = [headers.join(",")];
  rows.forEach((row) => {
    lines.push(headers.map((header) => escapeCell(row[header])).join(","));
  });
  return lines.join("\n");
};

module.exports = { toCsv };

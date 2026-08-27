const escapeCell = (value) => {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

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

// utils.js
export function parseSheetDate(dateStr) {
  // format input: "06/06/2025, 12.01.53"
  // kita convert ke objek Date JS yang valid

  if (!dateStr) return null;

  try {
    const [datePart, timePart] = dateStr.split(',').map(s => s.trim());
    const [day, month, year] = datePart.split('/').map(Number);
    const [hour, minute, second] = timePart.split('.').map(Number);

    // Note: di JS bulan 0-based
    return new Date(year, month - 1, day, hour, minute, second);
  } catch {
    return null;
  }
}

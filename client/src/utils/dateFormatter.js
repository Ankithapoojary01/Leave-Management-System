/**
 * Cleanly formats any date value (ISO timestamp, UTC string, or date string)
 * into a clean format like "29 Sep 2026".
 * Preserves the actual date without timezone drift.
 */
export const formatDateDisplay = (dateVal) => {
  if (!dateVal) return '—';

  // If already in "DD MMM YYYY" format (e.g. "29 Sep 2026" or "19 Sep 2026")
  if (typeof dateVal === 'string' && /^\d{1,2}\s+[A-Za-z]{3}\s+\d{4}$/.test(dateVal.trim())) {
    return dateVal.trim();
  }

  const d = new Date(dateVal);
  if (isNaN(d.getTime())) {
    return String(dateVal);
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // If the string representation contains UTC/GMT/Z or ISO 'T', use UTC to avoid off-by-one timezone offsets
  const isUtc = typeof dateVal === 'string' && (dateVal.includes('T') || dateVal.includes('Z') || dateVal.includes('GMT') || dateVal.includes('UTC'));
  const day = isUtc ? d.getUTCDate() : d.getDate();
  const month = months[isUtc ? d.getUTCMonth() : d.getMonth()];
  const year = isUtc ? d.getUTCFullYear() : d.getFullYear();

  return `${String(day).padStart(2, '0')} ${month} ${year}`;
};

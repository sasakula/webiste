// Helper format Bahasa Indonesia.
export function formatRupiah(n) {
  const v = Math.max(0, Math.floor(n));
  return 'Rp' + v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatNumber(n) {
  return Math.floor(n).toLocaleString('id-ID');
}

export function formatPercent(n, digits = 0) {
  return `${Number(n).toFixed(digits)}%`;
}

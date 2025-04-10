function formatNumber(value: number, digits = 2) {
  return new Intl.NumberFormat(undefined, {
    style: 'decimal',
    maximumFractionDigits: digits,
    useGrouping: true,
  }).format(value);
}

export {
  formatNumber,
};

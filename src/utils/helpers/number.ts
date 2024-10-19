function formatNumber(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: 'decimal',
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(value);
}

export {
  formatNumber,
};

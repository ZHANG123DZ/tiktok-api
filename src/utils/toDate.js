function toDate(day, month, year) {
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

module.exports = toDate;

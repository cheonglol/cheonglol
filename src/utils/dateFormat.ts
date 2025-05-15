export function formatBlogDate(dateStr: string): string {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const parts = dateStr.split("-");
  let year, month, day;
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      [year, month, day] = parts;
    } else {
      [day, month, year] = parts;
    }
    const monthIdx = Number(month) - 1;
    if (
      !isNaN(Number(year)) &&
      !isNaN(Number(month)) &&
      !isNaN(Number(day)) &&
      monthIdx >= 0 &&
      monthIdx < 12
    ) {
      return `${Number(day)} ${monthNames[monthIdx]} ${year}`;
    }
  }
  return `on ${dateStr}`;
}

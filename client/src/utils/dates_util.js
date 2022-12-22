export const months = [
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

export const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const getDaysByDate = (year, month) => {
  var date = new Date(year, month, 1);
  const days = [];

  const startMonthDay = weekDays[date.getDay() % weekDays.length];

  date.setDate(date.getDate() - weekDays.indexOf(startMonthDay));

  for (var i = 0; i < weekDays.indexOf(startMonthDay); i++) {
    days.push({
      dayOfTheWeek: weekDays[date.getDay() % weekDays.length],
      day: date.getDate(),
      month: month === 0 ? 11 : month - 1,
      year: month === 0 ? year - 1 : year,
      sameDate: date.getMonth() === month,
    });
    date.setDate(date.getDate() + 1);
  }

  for (var i = 0; i < 35 - weekDays.indexOf(startMonthDay); i++) {
    days.push({
      dayOfTheWeek: weekDays[date.getDay() % weekDays.length],
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      sameDate: date.getMonth() === month,
    });
    date.setDate(date.getDate() + 1);
  }
  return days;
};

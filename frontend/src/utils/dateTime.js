import dayjs from 'dayjs';

export const calculateTimeDifference = (startDate, endDate) => {
  const created = dayjs(startDate);
  const responded = dayjs(endDate);
  const diffDays = responded.diff(created, 'day');
  const diffMonths = responded.diff(created, 'month');
  const diffYears = responded.diff(created, 'year');
  const diffHours = responded.diff(created, 'hour');

  // If same day, show minutes and seconds
  if (diffDays === 0) {
    const mins = responded.diff(created, 'minute');
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    const secs = responded.diff(created, 'second') % 60;

    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMins} min ${secs} sec`;
    }
    return `${mins} min ${secs} sec`;
  }

  // If hours >= 24, show only days and hours
  if (diffHours >= 24) {
    const remainingHours = diffHours % 24;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
  }

  // If same year, show months and days
  if (diffYears === 0) {
    const remainingDays = diffDays % 30;
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
  }

  // Otherwise show years, months and days
  const remainingMonths = diffMonths % 12;
  const remainingDays = diffDays % 30;
  return `${diffYears} year${diffYears > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''} ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
};

export const millisecondsToReadable = (milliseconds) => {
  const now = dayjs();
  const date = dayjs(now - milliseconds); // Convert milliseconds to past date
  return calculateTimeDifference(date, now);
};

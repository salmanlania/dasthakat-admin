import dayjs from 'dayjs';

/**
 * Calculates and formats the time difference between two dates
 * @param {string|Date} startDate - The starting date/time
 * @param {string|Date} endDate - The ending date/time
 * @returns {string} Formatted string representing the time difference:
 * - For same day: returns hours, minutes and seconds (e.g. "2 hours 30 min 45 sec")
 * - For >24 hours: returns days and hours (e.g. "2 days 5 hours")
 * - For same year: returns months and days (e.g. "2 months 5 days")
 * - Otherwise: returns years, months and days (e.g. "1 year 2 months 5 days")
 */
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

    let result = '';
    if (hours > 0) {
      result += `${hours} hour${hours > 1 ? 's' : ''} `;
    }
    if (remainingMins > 0) {
      result += `${remainingMins} min `;
    }
    if (secs > 0) {
      result += `${secs} sec`;
    }
    return result.trim();
  }

  // If hours >= 24, show only days and hours
  if (diffHours >= 24) {
    const remainingHours = diffHours % 24;
    let result = '';
    if (diffDays > 0) {
      result += `${diffDays} day${diffDays > 1 ? 's' : ''} `;
    }
    if (remainingHours > 0) {
      result += `${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
    }
    return result.trim();
  }

  // If same year, show months and days
  if (diffYears === 0) {
    const remainingDays = diffDays % 30;
    let result = '';
    if (diffMonths > 0) {
      result += `${diffMonths} month${diffMonths > 1 ? 's' : ''} `;
    }
    if (remainingDays > 0) {
      result += `${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
    }
    return result.trim();
  }

  // Otherwise show years, months and days
  const remainingMonths = diffMonths % 12;
  const remainingDays = diffDays % 30;
  let result = '';
  if (diffYears > 0) {
    result += `${diffYears} year${diffYears > 1 ? 's' : ''} `;
  }
  if (remainingMonths > 0) {
    result += `${remainingMonths} month${remainingMonths > 1 ? 's' : ''} `;
  }
  if (remainingDays > 0) {
    result += `${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
  }
  return result.trim();
};

/**
 * Converts minutes to a human-readable time difference string
 * @param {number} minutes - Number of minutes to convert
 * @returns {string} Formatted time difference string using calculateTimeDifference
 */
export const minutesToReadable = (minutes) => {
  const now = dayjs();
  const date = dayjs(now).subtract(minutes, 'minute'); // Convert minutes to past date
  return calculateTimeDifference(date, now);
};

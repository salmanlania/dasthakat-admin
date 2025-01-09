/**
 * Formats a number with commas as thousands separators.
 *
 * @param {number|string} num - The number to be formatted.
 * @returns {string} - The formatted number with commas, or an empty string if the input is falsy.
 */
export const formatThreeDigitCommas = (num) => {
  if (!num) return '';
  num = num.toString();
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Removes all commas from a string or number.
 *
 * @param {string|number} num - The string or number from which commas will be removed.
 * @returns {string} - The input without commas, or an empty string if the input is falsy.
 */
export const removeCommas = (num) => {
  return num ? num.replace(/,/g, '') : '';
};

/**
 * Rounds a number to a specified number of decimal places.
 *
 * @param {number} value - The number to be rounded.
 * @param {number} [fixed=3] - The number of decimal places to round to. Default is 3.
 * @returns {number|string} - The rounded number, or an empty string if the input is falsy.
 */
export function roundUpto(value, fixed = 2) {
  if (!value && value !== 0) return '';
  const roundedValue = Number(value.toFixed(fixed));
  return parseFloat(roundedValue);
}

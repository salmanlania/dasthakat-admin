/* eslint-disable react/prop-types */
import { Input } from "antd";
import { formatThreeDigitCommas, removeCommas } from "../../utils/number";

/**
 * CommaSeparatedInput Component
 *
 * This component provides a number input field that formats numbers with commas for better readability.
 * It allows specifying a maximum number of decimal places and ensures valid input.
 *
 * @param {Object} props - Component props
 * @param {string | number} [props.value=""] - The current value of the input
 * @param {function} props.onChange - Callback function triggered when the input value changes.
 *                                    It receives the raw value (without commas).
 * @param {number} [props.decimalPlaces=3] - The maximum number of decimal places allowed
 * @param {Object} [restProps] - Any additional props passed to the Ant Design Input component
 *
 * @returns {JSX.Element} - A formatted input component with three-digit comma separators
 */
const CommaSeparatedInput = ({
  value = "",
  onChange = () => {},
  decimalPlaces = 2,
  ...restProps
}) => {
  // Handle input change
  const handleInputChange = (e) => {
    let rawValue = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and dots

    // Restrict to only one dot
    const parts = rawValue.split(".");
    if (parts.length > 2) {
      rawValue = parts[0] + "." + parts.slice(1).join("");
    }

    // Restrict to the specified number of decimal places
    if (rawValue.includes(".")) {
      const [integerPart, decimalPart] = rawValue.split(".");
      rawValue = `${integerPart}.${decimalPart.slice(0, decimalPlaces)}`;
    }

    const formattedValue = formatThreeDigitCommas(rawValue);

    // Call the onChange prop with the raw value (without commas)
    if (onChange) {
      onChange(removeCommas(formattedValue)); // Pass the raw value without commas to the form
    }
  };

  return (
    <Input
      {...restProps}
      value={formatThreeDigitCommas(value)} // Display the formatted value with commas
      onChange={handleInputChange} // Handle input change and format the value
    />
  );
};

export default CommaSeparatedInput;

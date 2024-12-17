import { Input } from "antd";

/**
 * NumberInput Component
 *
 * @param {Object} props - Component props
 * @param {string | number} [props.value=""] - The value of the input
 * @param {function} props.onChange - Callback when input value changes
 * @param {"integer" | "decimal"} [props.type="integer"] - Input type: "integer" allows whole numbers, "decimal" allows decimals
 * @param {Object} restProps - Any other props for the Ant Design Input component
 * @returns {JSX.Element} - NumberInput component
 */
const NumberInput = ({
  value = "",
  onChange,
  type = "integer",
  ...restProps
}) => {
  value = value ? value.toString() : "";

  // Handle input change
  const handleInputChange = (e) => {
    let rawValue = e.target.value;

    if (type === "integer") {
      // Remove all non-numeric characters
      rawValue = rawValue.replace(/[^0-9]/g, "");
    } else if (type === "decimal") {
      // Allow only numbers and one decimal point
      rawValue = rawValue.replace(/[^0-9.]/g, ""); // Remove invalid characters
      rawValue = rawValue.replace(/^(\d*\.\d*)\./, "$1"); // Prevent multiple decimal points
    }

    // Call the onChange prop with the cleaned value
    if (onChange) {
      onChange(rawValue);
    }
  };

  return (
    <Input
      {...restProps}
      value={value} // Value remains a plain number
      onChange={handleInputChange} // Clean input based on type
    />
  );
};

export default NumberInput;

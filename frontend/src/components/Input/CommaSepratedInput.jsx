import React from "react";
import { Input } from "antd";

// Function to format numbers with commas
export const formatThreeDigitCommas = (num) => {
  if (!num) return "";
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Function to remove commas
export const removeCommas = (num) => {
  return num ? num.replace(/,/g, "") : "";
};

const CommaSeparatedInput = ({ value = "", onChange, ...restProps }) => {
  // Handle input change
  const handleInputChange = (e) => {
    let rawValue = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and dots

    // Restrict to only one dot
    const parts = rawValue.split(".");
    if (parts.length > 2) {
      rawValue = parts[0] + "." + parts.slice(1).join("");
    }

    // Restrict to 3 decimal places
    if (rawValue.includes(".")) {
      const [integerPart, decimalPart] = rawValue.split(".");
      rawValue = `${integerPart}.${decimalPart.slice(0, 3)}`;
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

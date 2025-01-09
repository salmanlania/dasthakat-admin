/* eslint-disable react/prop-types */
import { Input } from 'antd';
import { useEffect, useRef, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';

/**
 * DebouncedNumberInput Component
 *
 * @param {Object} props - Component props
 * @param {string | number} [props.value=""] - The value of the input
 * @param {function} props.onChange - Callback when input value changes
 * @param {"integer" | "decimal"} [props.type="integer"] - Input type: "integer" allows whole numbers, "decimal" allows decimals
 * @param {Object} restProps - Any other props for the Ant Design Input component
 * @returns {JSX.Element} - DebouncedNumberInput component
 */
const DebouncedNumberInput = ({
  value = '',
  onChange = () => {},
  type = 'integer',
  delay = 500,
  ...restProps
}) => {
  const isFirstRender = useRef(true);
  const [inputValue, setInputValue] = useState(value || value === 0 ? value.toString() : '');
  const debouncedValue = useDebounce(inputValue, delay);

  // Handle input change
  const handleInputChange = (e) => {
    let rawValue = e.target.value;

    if (type === 'integer') {
      // Remove all non-numeric characters
      rawValue = rawValue.replace(/[^0-9]/g, '');
    } else if (type === 'decimal') {
      // Allow only numbers and one decimal point
      rawValue = rawValue.replace(/[^0-9.]/g, ''); // Remove invalid characters
      rawValue = rawValue.replace(/^(\d*\.\d*)\./, '$1'); // Prevent multiple decimal points
    }

    // Call the onChange prop with the cleaned value
    if (onChange) {
      setInputValue(rawValue);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    onChange(debouncedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <Input
      {...restProps}
      value={inputValue} // Value remains a plain number
      onChange={handleInputChange} // Clean input based on type
    />
  );
};

export default DebouncedNumberInput;

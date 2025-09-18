/* eslint-disable react/prop-types */
import { Input } from 'antd';
import { useEffect, useRef, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';
import { formatThreeDigitCommas, removeCommas } from '../../utils/number';

/**
 * DebouncedCommaSeparatedInputRate Component
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
const DebouncedCommaSeparatedInputRate = ({
  value = '',
  onChange = () => { },
  decimalPlaces = 2,
  delay = 500,
  ...restProps
}) => {
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(formatThreeDigitCommas(value?.toString() || ''))
    }

  }, [value])

  const handleInputChange = (e) => {
    let rawValue = e.target.value.replace(/[^0-9.]/g, '');

    const parts = rawValue.split('.');
    if (parts.length > 2) {
      rawValue = parts[0] + '.' + parts.slice(1).join('');
    }

    if (rawValue.includes('.')) {
      const [integerPart, decimalPart] = rawValue.split('.');
      rawValue = `${integerPart}.${decimalPart.slice(0, decimalPlaces)}`;
    }

    setInputValue(rawValue)
  };

  return (
    <Input
      {...restProps}

      value={inputValue}
      onChange={handleInputChange}
      onBlur={() => {
        const cleaned = removeCommas(inputValue);
        const formatted = formatThreeDigitCommas(cleaned);
        setInputValue(formatted);
        onChange(cleaned);
      }}
    />
  );
};

export default DebouncedCommaSeparatedInputRate;

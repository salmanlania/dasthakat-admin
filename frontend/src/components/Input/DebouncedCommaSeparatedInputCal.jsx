/* eslint-disable react/prop-types */
import { Input } from 'antd';
import { useEffect, useState } from 'react';
import { formatThreeDigitCommas, removeCommas } from '../../utils/number';

/**
 * DebouncedCommaSeparatedInputCal Component
 *
 * Supports math expressions (e.g., 20000.23+50 -> 20050.23).
 * Formats result with commas and enforces decimal places.
 */
const DebouncedCommaSeparatedInputCal = ({
  value = '',
  onChange = () => { },
  decimalPlaces = 2,
  ...restProps
}) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(formatThreeDigitCommas(value?.toString() || ''));
    }
  }, [value]);

  const handleInputChange = (e) => {
    let rawValue = e.target.value;

    // Allow numbers, decimal, + - * /
    rawValue = rawValue.replace(/[^0-9+\-*/.]/g, '');

    setInputValue(rawValue);
  };

  const handleBlur = () => {
    try {
      // Remove commas for evaluation
      const rawExpression = removeCommas(inputValue);

      // Safe eval: only numbers/operators allowed
      if (/^[0-9+\-*/.]+$/.test(rawExpression)) {
        let evaluated = Function(`"use strict"; return (${rawExpression})`)();

        if (!isNaN(evaluated)) {
          // Fix decimals
          evaluated = parseFloat(evaluated).toFixed(decimalPlaces);

          // Format commas
          const formatted = formatThreeDigitCommas(evaluated);
          setInputValue(formatted);
          onChange(parseFloat(evaluated));
          return;
        }
      }
    } catch (err) {
      console.warn('Invalid expression:', err);
    }

    // Fallback if invalid
    const cleaned = removeCommas(inputValue);
    const formatted = formatThreeDigitCommas(cleaned);
    setInputValue(formatted);
    onChange(parseFloat(cleaned) || 0);
  };

  return (
    <Input
      {...restProps}
      value={inputValue}
      onChange={handleInputChange}
      onBlur={handleBlur}
      onPressEnter={handleBlur}
    />
  );
};

export default DebouncedCommaSeparatedInputCal;

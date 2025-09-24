/* eslint-disable react/prop-types */
import { Input } from 'antd';
import { useEffect, useRef, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';

/**
 * DebouncedNumberInputMarkup Component
 *
 * @param {Object} props - Component props
 * @param {string | number} [props.value=""] - The value of the input
 * @param {function} props.onChange - Callback when input value changes
 * @param {"integer" | "decimal"} [props.type="integer"] - Input type: "integer" allows whole numbers, "decimal" allows decimals
 * @param {Object} restProps - Any other props for the Ant Design Input component
 * @returns {JSX.Element} - DebouncedNumberInputMarkup component
 */
const DebouncedNumberInputMarkup = ({
  value = '',
  onChange = () => { },
  type = 'integer',
  delay = 500,
  ...restProps
}) => {

  const [inputValue, setInputValue] = useState(value)

  const handleInputChange = (e) => {
    let rawValue = e.target.value;

    if (type === 'integer') {
      rawValue = rawValue.replace(/[^0-9]/g, '');
    } else if (type === 'decimal') {
      rawValue = rawValue.replace(/[^0-9.]/g, '');
      rawValue = rawValue.replace(/^(\d*\.\d*)\./, '$1');
    }
    setInputValue(rawValue);
  };


  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value)
    }

  }, [value])

  return (
    <Input
      {...restProps}
      value={inputValue}
      onChange={handleInputChange}
      onBlur={() => {
        onChange(inputValue)
      }}
    />
  );
};

export default DebouncedNumberInputMarkup;

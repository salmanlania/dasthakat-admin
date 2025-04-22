/* eslint-disable react/prop-types */
import { Input } from 'antd';

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
const NumberInput = ({ value = '', onChange = () => {}, type = 'integer', ...restProps }) => {
  const handleInputChange = (e) => {
    let rawValue = e.target.value;

    if (type === 'integer') {
      rawValue = rawValue.replace(/[^0-9]/g, '');
    } else if (type === 'decimal') {
      rawValue = rawValue.replace(/[^0-9.]/g, '');
      rawValue = rawValue.replace(/^(\d*\.\d*)\./, '$1'); 
    }

    if (onChange) {
      onChange(rawValue);
    }
  };

  return (
    <Input
      {...restProps}
      value={value}
      onChange={handleInputChange}
    />
  );
};

export default NumberInput;

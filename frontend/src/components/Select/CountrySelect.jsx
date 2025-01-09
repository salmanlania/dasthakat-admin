import { Select } from 'antd';
import Flag from 'react-world-flags';
import countries from '../../assets/data/countries.json';

// eslint-disable-next-line react/prop-types
const CountrySelect = ({ size = 'middle', ...props }) => {
  return (
    <Select showSearch {...props} size={size}>
      {countries.map((country) => (
        <Select.Option key={country.name} value={country.name}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Flag
              code={country.code}
              className={size === 'small' ? 'mr-2 h-3 w-4' : 'mr-2 h-4 w-6'}
            />
            <span>{country.name}</span>
          </div>
        </Select.Option>
      ))}
    </Select>
  );
};

export default CountrySelect;

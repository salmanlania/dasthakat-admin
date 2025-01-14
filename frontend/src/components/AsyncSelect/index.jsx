/* eslint-disable react/prop-types */
import { Select, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { MdOutlineAddCircle } from 'react-icons/md';
import api from '../../axiosInstance';
import useDebounce from '../../hooks/useDebounce';
import useError from '../../hooks/useError';

const { Option } = Select;

const AsyncSelect = ({
  endpoint,
  labelInValue = false,
  params = {},
  dependencies = [],
  valueKey,
  labelKey,
  addNewLink,
  defaultFirstSelected = false,
  ...props
}) => {
  const [isClicked, setIsClicked] = useState(defaultFirstSelected);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const dropdownRef = useRef();
  const handleError = useError();

  const debouncedSearch = useDebounce(searchValue, 500);

  const isAddNewVisible = addNewLink && !props?.disabled;

  const fetchData = async (inputValue = '', page = 1, merge = false) => {
    setLoading(true);
    try {
      // Make API call to fetch options based on the inputValue and pagination
      const response = await api.get(endpoint, {
        params: { ...params, search: inputValue, page }
      });

      let data = response.data;

      let optionsData = [];
      if (valueKey && labelKey) {
        optionsData = response.data.data.map((item) => ({
          value: item[valueKey],
          label: item[labelKey]
        }));
      } else {
        optionsData = response.data.data;
      }

      merge
        ? setOptions((prevOptions) => [...prevOptions, ...optionsData])
        : setOptions(optionsData);
      setHasMore(page < data.last_page);

      if (defaultFirstSelected && optionsData.length > 0 && !props.value) {
        props.onChange && props.onChange(optionsData[0]);
      }
    } catch (error) {
      handleError(error, false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isClicked) {
      setOptions([]);
      setPage(1);
      fetchData(debouncedSearch, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, isClicked, ...dependencies]);

  const handleInputChange = (value) => setSearchValue(value);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = dropdownRef.current;
    if (scrollTop + clientHeight === scrollHeight && hasMore && !loading) {
      const nextPage = page + 1; // Calculate the next page
      setPage(nextPage); // Update the page state
      fetchData(searchValue, nextPage, true); // Fetch data for the next page
    }
  };

  return (
    <Select
      showSearch
      allowClear
      onSearch={handleInputChange}
      onClear={() => {
        setSearchValue('');
      }}
      loading={loading}
      filterOption={false}
      onFocus={() => setIsClicked(true)}
      {...props}
      onChange={(v) => {
        props.onChange && props.onChange(v);
        setSearchValue('');
      }}
      onPopupScroll={handleScroll}
      notFoundContent={
        loading ? (
          <div className="text-center">
            <Spin size="small" />
          </div>
        ) : null
      }
      dropdownRender={(menu) => (
        <div
          ref={dropdownRef}
          onScroll={handleScroll}
          style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {menu}
        </div>
      )}
      labelInValue={labelInValue}
      suffixIcon={
        isAddNewVisible ? (
          <MdOutlineAddCircle
            className="absolute !-top-4 cursor-pointer rounded-full bg-white text-primary hover:text-blue-700"
            size={18}
            onClick={() => {
              setIsClicked(false);
              window.open(
                `/gms${addNewLink}`,
                '_blank',
                'toolbar=yes,scrollbars=yes,top=100,left=400,width=600,height=600'
              );
            }}
          />
        ) : undefined
      }>
      {options.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

export default AsyncSelect;

/* eslint-disable react/prop-types */
import { Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { MdOutlineAddCircle } from 'react-icons/md';
import api from '../../axiosInstance';
import useError from '../../hooks/useError';

const AsyncSelectNoPaginate = ({
  endpoint,
  dependencies = [],
  labelInValue = false,
  valueKey,
  labelKey,
  addNewLink,
  ...props
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleError = useError();

  const isAddNewVisible = addNewLink && !props?.disabled;

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(endpoint);
      let data = response.data;
      if (valueKey && labelKey) {
        data = data.map((item) => ({
          value: item[valueKey],
          label: item[labelKey]
        }));
      }
      setOptions(data);
    } catch (error) {
      handleError(error, false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isClicked) {
      setOptions([]);
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClicked, ...dependencies]);

  return (
    <Select
      showSearch
      allowClear
      loading={loading}
      labelInValue={labelInValue}
      {...props}
      onFocus={() => setIsClicked(true)}
      notFoundContent={
        loading ? (
          <div className="text-center">
            <Spin size="small" />
          </div>
        ) : null
      }
      suffixIcon={
        isAddNewVisible ? (
          <MdOutlineAddCircle
            className="absolute !-top-4 cursor-pointer bg-white text-primary hover:text-blue-700"
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
        ) : null
      }
      optionFilterProp="label"
      options={options}
    />
  );
};

export default AsyncSelectNoPaginate;

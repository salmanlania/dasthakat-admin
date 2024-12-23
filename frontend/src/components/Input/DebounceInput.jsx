import { Input } from "antd";
import { useEffect, useRef, useState } from "react";
import useDebounce from "../../hooks/useDebounce";

// eslint-disable-next-line react/prop-types
const DebounceInput = ({ value, onChange, delay = 500, ...props }) => {
  const isFirstRender = useRef(true);
  const [inputValue, setInputValue] = useState(value || "");
  const debouncedValue = useDebounce(inputValue, delay);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onChange(debouncedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  return (
    <Input
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      {...props}
    />
  );
};

export default DebounceInput;

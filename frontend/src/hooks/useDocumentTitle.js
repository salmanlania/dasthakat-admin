import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Global Marine Safety - America`;
    }
  }, [title]);
};

export default useDocumentTitle;

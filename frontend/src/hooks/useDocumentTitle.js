import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Dasthakat`;
    }
  }, [title]);
};

export default useDocumentTitle;

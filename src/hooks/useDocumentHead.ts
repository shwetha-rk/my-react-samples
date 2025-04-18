import { useEffect } from 'react';

interface DocumentHeadProps {
  title?: string;
  description?: string;
}

export const useDocumentHead = ({ title, description }: DocumentHeadProps) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} - My React App`;
    }
    
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
    }
  }, [title, description]);
};
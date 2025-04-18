import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export interface SearchableSection {
  id: string;
  title: string;
  description: string;
  content: string;
  path: string;
  heading?: string;
}

const pageContent = {
  home: [
    {
      id: 'home-welcome',
      title: 'Welcome',
      description: 'Welcome to our modern React application',
      content: 'Discover our feature-rich React application with modern design and seamless user experience.',
      path: '/',
      heading: 'Welcome to Our App'
    },
    {
      id: 'home-features',
      title: 'Features',
      description: 'Key features of our application',
      content: 'Dark mode support, keyboard shortcuts, responsive design, and fast navigation.',
      path: '/',
      heading: 'Features'
    }
  ],
  about: [
    {
      id: 'about-mission',
      title: 'Our Mission',
      description: 'Learn about our mission and goals',
      content: 'We strive to create exceptional user experiences through modern web technologies.',
      path: '/about',
      heading: 'Our Mission'
    },
    {
      id: 'about-team',
      title: 'Our Team',
      description: 'Meet our dedicated team',
      content: 'A group of passionate developers and designers working together.',
      path: '/about',
      heading: 'Team'
    }
  ],
  contact: [
    {
      id: 'contact-info',
      title: 'Contact Information',
      description: 'How to reach us',
      content: 'Get in touch with us through email, phone, or social media.',
      path: '/contact',
      heading: 'Contact Us'
    },
    {
      id: 'contact-support',
      title: 'Support',
      description: 'Customer support information',
      content: 'We provide 24/7 customer support to assist you.',
      path: '/contact',
      heading: 'Support'
    }
  ]
};

export function useSearchableContent() {
  const location = useLocation();

  const allContent = useMemo(() => {
    return Object.values(pageContent).flat();
  }, []);

  const currentPageContent = useMemo(() => {
    const path = location.pathname.substring(1) || 'home';
    return pageContent[path as keyof typeof pageContent] || [];
  }, [location.pathname]);

  return {
    allContent,
    currentPageContent
  };
}
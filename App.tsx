
// FIX: Corrected the malformed React import to properly import hooks and context.
import React, { useState, useEffect, createContext } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ContentProvider, useContent } from './contexts/ContentContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ResearchPage from './pages/ResearchPage';
import AcademicsPage from './pages/AcademicsPage';
import PeoplePage from './pages/PeoplePage';
import FacilitiesPage from './pages/FacilitiesPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import SystemDetailPage from './pages/SystemDetailPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import BackToTopButton from './components/BackToTopButton';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import { Loader, AlertTriangle } from 'lucide-react';
import SoftwarePage from './pages/SoftwarePage';
import ServicesPage from './pages/ServicesPage';

// FIX: Explicitly defining the ThemeContextType and applying it to createContext. This resolves a circular dependency issue where Header.tsx could not infer the context's shape correctly.
export interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there is a hash, scroll to the element
    if (hash) {
      const id = hash.replace('#', '');
      // Use a timeout to allow the page to render before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Otherwise, scroll to the top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  return null;
};


const AppRoutes = () => {
  const location = useLocation();
  const { loading, error } = useContent();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-128px)]">
        <Loader className="w-12 h-12 text-brand-blue dark:text-brand-orange animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] text-center">
        <AlertTriangle className="w-16 h-16 text-red-500" />
        <h2 className="mt-4 text-2xl font-bold">Failed to load content</h2>
        <p className="mt-2 text-slate-600 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/academics" element={<AcademicsPage />} />
        <Route path="/people" element={<PeoplePage />} />
        <Route path="/facilities" element={<FacilitiesPage />} />
        <Route path="/systems/:systemId" element={<SystemDetailPage />} />
        <Route path="/software/:softwareId" element={<SoftwarePage />} />
        <Route path="/software" element={<SoftwarePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

const App: React.FC = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // Class for top shadow
      if (scrollTop > 10) {
        document.body.classList.add('scrolled-from-top');
      } else {
        document.body.classList.remove('scrolled-from-top');
      }

      // Class for bottom shadow
      if (scrollTop + clientHeight < scrollHeight - 10) {
        document.body.classList.add('scrolled-from-bottom');
      } else {
        document.body.classList.remove('scrolled-from-bottom');
      }
    };

    const observer = new ResizeObserver(handleScroll);
    observer.observe(document.documentElement);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check for initial render state
    setTimeout(handleScroll, 100);

    return () => {
        window.removeEventListener('scroll', handleScroll);
        observer.disconnect();
        // Cleanup classes on unmount
        document.body.classList.remove('scrolled-from-top', 'scrolled-from-bottom');
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ContentProvider>
        <HashRouter>
          <ScrollToTop />
          {/* FIX: Wrap framer-motion props in a spread object to work around TypeScript type inference issues. */}
          <motion.div 
            className="flex flex-col min-h-screen font-sans bg-white dark:bg-slate-900 text-slate-800 dark:text-gray-200"
          >
            <Header />
            <main className="flex-grow pt-[100px] lg:pt-[150px]">
              <AppRoutes />
            </main>
            <Footer />
            <BackToTopButton />
          </motion.div>
        </HashRouter>
      </ContentProvider>
    </ThemeContext.Provider>
  );
};

export default App;

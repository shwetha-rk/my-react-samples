import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HashRouter } from 'react-router-dom'; // Note 1

import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import { PeriodTrackerProvider } from './contexts/PeriodTrackerContext';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import PeriodTracker from './pages/PeriodTracker';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <PeriodTrackerProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="period-tracker" element={<PeriodTracker />} />
              </Route>
            </Routes>
            <Toaster position="top-right" toastOptions={{
              className: 'dark:bg-gray-800 dark:text-white',
              duration: 3000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
              },
            }} />
          </HashRouter>
        </PeriodTrackerProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;

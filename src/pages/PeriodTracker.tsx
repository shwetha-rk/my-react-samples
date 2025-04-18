import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { UserManagement } from '../components/UserManagement';
import { PeriodEntryList } from '../components/PeriodEntryList';
import { useUser } from '../contexts/UserContext';

const PeriodTracker = () => {
  const { currentUserId, getCurrentUser } = useUser();
  const currentUser = getCurrentUser();

  return (
    <>
      <Helmet>
        <title>Period Tracker - My React App</title>
        <meta name="description" content="Track and manage your menstrual cycles" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-8"
      >
        <div className="border-b border-gray-200 dark:border-gray-700 pb-5">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Period Tracker
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your menstrual cycles, symptoms, and get insights about your patterns.
          </p>
        </div>

        <UserManagement />

        {currentUser ? (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Period Entries for {currentUser.name}
              </h2>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Track and manage period entries for the selected user.
              </p>
            </div>
            <PeriodEntryList userId={currentUserId || ''} />
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">
              Please select or add a user to manage period entries.
            </p>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default PeriodTracker;
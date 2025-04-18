import React, { useState } from 'react';
import { CalendarIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { PeriodEntry, usePeriodTracker } from '../contexts/PeriodTrackerContext';
import { PeriodEntryForm } from './PeriodEntryForm';

interface Props {
  userId: string;
}

export const PeriodEntryList: React.FC<Props> = ({ userId }) => {
  const { getEntriesByUser, getUserStats, deleteEntry, updateEntry, addEntry } = usePeriodTracker();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<PeriodEntry | undefined>();

  const entries = getEntriesByUser(userId);
  const stats = getUserStats(userId);

  const handleEdit = (entry: PeriodEntry) => {
    setSelectedEntry(entry);
    setIsFormOpen(true);
  };

  const handleSubmit = (entryData: Omit<PeriodEntry, 'id'>) => {
    if (selectedEntry) {
      updateEntry(selectedEntry.id, entryData);
    } else {
      addEntry(entryData);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Period Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Average Cycle Length</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.averageCycleLength ? `${stats.averageCycleLength} days` : 'N/A'}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Last Period</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.lastPeriodDate ? new Date(stats.lastPeriodDate).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Next Period (Predicted)</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.nextPeriodPrediction ? new Date(stats.nextPeriodPrediction).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Period Entries</h2>
          <button
            onClick={() => {
              setSelectedEntry(undefined);
              setIsFormOpen(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Entry
          </button>
        </div>

        {entries.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No entries yet. Click "Add Entry" to get started.
          </p>
        ) : (
          <div className="space-y-4">
            {entries
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Flow:</span>
                      <span className="ml-2 text-gray-900 dark:text-white capitalize">{entry.flow}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Mood:</span>
                      <span className="ml-2 text-gray-900 dark:text-white capitalize">{entry.mood}</span>
                    </div>
                  </div>

                  {entry.symptoms.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Symptoms:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entry.symptoms.map((symptom, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {entry.notes && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Notes:</span>
                      <p className="mt-1 text-gray-900 dark:text-white">{entry.notes}</p>
                    </div>
                  )}
                </motion.div>
              ))}
          </div>
        )}
      </div>

      <PeriodEntryForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedEntry(undefined);
        }}
        onSubmit={handleSubmit}
        initialData={selectedEntry}
        userId={userId}
      />
    </div>
  );
};
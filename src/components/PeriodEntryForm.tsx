import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import { motion } from 'framer-motion';
import { PeriodEntry } from '../contexts/PeriodTrackerContext';
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: Omit<PeriodEntry, 'id'>) => void;
  initialData?: PeriodEntry;
  userId: string;
}

const moodOptions = ['happy', 'sad', 'neutral', 'irritated', 'energetic', 'tired'] as const;
const flowOptions = ['light', 'medium', 'heavy'] as const;
const commonSymptoms = ['cramps', 'headache', 'bloating', 'fatigue', 'backache', 'nausea'];

export const PeriodEntryForm: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialData, userId }) => {
  const [date, setDate] = React.useState<Date>(initialData?.date ?? new Date());
  const [flow, setFlow] = React.useState<PeriodEntry['flow']>(initialData?.flow ?? 'medium');
  const [mood, setMood] = React.useState<PeriodEntry['mood']>(initialData?.mood ?? 'neutral');
  const [symptoms, setSymptoms] = React.useState<string[]>(initialData?.symptoms ?? []);
  const [notes, setNotes] = React.useState(initialData?.notes ?? '');
  const [customSymptom, setCustomSymptom] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      userId,
      date,
      flow,
      mood,
      symptoms,
      notes
    });
    onClose();
  };

  const handleSymptomToggle = (symptom: string) => {
    setSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleAddCustomSymptom = () => {
    if (customSymptom && !symptoms.includes(customSymptom)) {
      setSymptoms(prev => [...prev, customSymptom]);
      setCustomSymptom('');
    }
  };

  return (
    <Dialog
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                {initialData ? 'Edit Period Entry' : 'New Period Entry'}
              </Dialog.Title>
              <button
                onClick={onClose}
                className="rounded-md p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <DatePicker
                  selected={date}
                  onChange={(date: Date | null) => date && setDate(date)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Flow
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {flowOptions.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFlow(option)}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        flow === option
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300'
                      }`}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mood
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {moodOptions.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setMood(option)}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        mood === option
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300'
                      }`}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Symptoms
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {commonSymptoms.map(symptom => (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => handleSymptomToggle(symptom)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        symptoms.includes(symptom)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                    placeholder="Add custom symptom"
                    className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSymptom}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {initialData ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};
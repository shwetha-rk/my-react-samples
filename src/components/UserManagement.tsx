import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, PencilIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, User } from '../contexts/UserContext';
import "react-datepicker/dist/react-datepicker.css";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: User;
}

const UserForm: React.FC<UserFormProps> = ({ isOpen, onClose, initialData }) => {
  const { addUser, updateUser } = useUser();
  const [name, setName] = useState(initialData?.name ?? '');
  const [email, setEmail] = useState(initialData?.email ?? '');
  const [dateOfBirth, setDateOfBirth] = useState<Date>(initialData?.dateOfBirth ?? new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      updateUser(initialData.id, { name, email, dateOfBirth });
    } else {
      addUser({ name, email, dateOfBirth });
    }
    onClose();
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
                {initialData ? 'Edit User' : 'Add New User'}
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
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date of Birth
                </label>
                <DatePicker
                  selected={dateOfBirth}
                  onChange={(date: Date | null) => date && setDateOfBirth(date)}
                  maxDate={new Date()}
                  showYearDropdown
                  dateFormat="MMMM d, yyyy"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
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
                  {initialData ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  userName 
}) => {
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
            <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
              Delete User
            </Dialog.Title>
            <div className="mt-4">
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to delete {userName}? This action cannot be undone, and all associated period entries will be deleted.
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export const UserManagement = () => {
  const { users, currentUserId, setCurrentUserId, deleteUser } = useUser();
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [deletingUser, setDeletingUser] = useState<User | undefined>();

  const handleDeleteUser = (user: User) => {
    setDeletingUser(user);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Users</h2>
        <button
          onClick={() => setShowAddUser(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add User
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map(user => (
          <div
            key={user.id}
            className={`p-4 rounded-lg border ${
              currentUserId === user.id
                ? 'border-blue-500 dark:border-blue-400'
                : 'border-gray-200 dark:border-gray-700'
            } bg-white dark:bg-gray-800`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: user.avatarColor }}
                >
                  <UserCircleIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{user.name}</h3>
                  {user.email && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingUser(user)}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteUser(user)}
                  className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Birth date: {user.dateOfBirth.toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Added: {user.createdAt.toLocaleDateString()}
              </p>
            </div>

            <button
              onClick={() => setCurrentUserId(currentUserId === user.id ? null : user.id)}
              className={`mt-4 w-full py-2 px-3 rounded-md text-sm font-medium ${
                currentUserId === user.id
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {currentUserId === user.id ? 'Selected' : 'Select User'}
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {(showAddUser || editingUser) && (
          <UserForm
            isOpen={true}
            onClose={() => {
              setShowAddUser(false);
              setEditingUser(undefined);
            }}
            initialData={editingUser}
          />
        )}
        {deletingUser && (
          <DeleteConfirmationDialog
            isOpen={true}
            onClose={() => setDeletingUser(undefined)}
            onConfirm={() => deleteUser(deletingUser.id)}
            userName={deletingUser.name}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
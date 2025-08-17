// src/App.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { InputField } from './components/InputField/InputField';
import { DataTable } from './components/DataTable/DataTable';
import type { Column } from './components/DataTable/DataTable';

type User = {
  id: number;
  name: string;
  email: string;
  age: number;
  department: string;
  active: boolean;
  avatar?: string;
  joinDate: string;
  salary: number;
};

// Fixed Animation variants with proper typing
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const cardVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "backOut"
    }
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      duration: 0.3
    }
  }
};

const buttonVariants: Variants = {
  idle: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.95 }
};

// Enhanced columns with better animations
const columns: Column<User>[] = [
  {
    key: 'avatar',
    title: '',
    dataIndex: 'name',
    width: 60,
    render: (name: string) => (
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg"
      >
        {String(name).charAt(0).toUpperCase()}
      </motion.div>
    ),
  },
  { 
    key: 'name', 
    title: 'Full Name', 
    dataIndex: 'name', 
    sortable: true,
    render: (name: string, record: User) => (
      <motion.div
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{ x: 5 }}
        className="flex flex-col"
      >
        <span className="font-semibold text-gray-900 dark:text-gray-100">{name}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{record.department}</span>
      </motion.div>
    ),
  },
  { 
    key: 'email', 
    title: 'Email Address', 
    dataIndex: 'email', 
    sortable: true,
    render: (email: string) => (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ 
          scale: 1.05,
          color: '#3B82F6',
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.95 }}
        className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer transition-colors"
      >
        {email}
      </motion.span>
    ),
  },
  { 
    key: 'age', 
    title: 'Age', 
    dataIndex: 'age', 
    sortable: true,
    width: 80,
    align: 'center' as const,
    render: (age: number) => (
      <motion.span
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.2, rotate: 5 }}
        transition={{ duration: 0.4 }}
        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium"
      >
        {age}
      </motion.span>
    ),
  },
  {
    key: 'salary',
    title: 'Salary',
    dataIndex: 'salary',
    sortable: true,
    align: 'right' as const,
    render: (salary: number) => (
      <motion.span
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.4 }}
        className="font-semibold text-green-600 dark:text-green-400"
      >
        ${salary.toLocaleString()}
      </motion.span>
    ),
  },
  {
    key: 'joinDate',
    title: 'Join Date',
    dataIndex: 'joinDate',
    sortable: true,
    render: (date: string) => (
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-gray-600 dark:text-gray-300"
      >
        {new Date(date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })}
      </motion.span>
    ),
  },
  {
    key: 'active',
    title: 'Status',
    dataIndex: 'active',
    width: 100,
    align: 'center' as const,
    render: (active: boolean) => (
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.4 }}
        className="flex justify-center"
      >
        <motion.span
          animate={{ 
            backgroundColor: active ? '#10B981' : '#EF4444'
          }}
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            active 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          <motion.span
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              ease: "easeInOut"
            }}
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${active ? 'bg-green-400' : 'bg-red-400'}`}
          />
          {active ? 'Active' : 'Inactive'}
        </motion.span>
      </motion.div>
    ),
  },
];

const initialUsers: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice.johnson@company.com', age: 28, department: 'Engineering', active: true, joinDate: '2022-03-15', salary: 85000 },
  { id: 2, name: 'Bob Smith', email: 'bob.smith@company.com', age: 32, department: 'Marketing', active: false, joinDate: '2021-08-22', salary: 65000 },
  { id: 3, name: 'Carol Williams', email: 'carol.williams@company.com', age: 24, department: 'Design', active: true, joinDate: '2023-01-10', salary: 70000 },
  { id: 4, name: 'David Brown', email: 'david.brown@company.com', age: 36, department: 'Sales', active: false, joinDate: '2020-11-05', salary: 75000 },
  { id: 5, name: 'Erin Davis', email: 'erin.davis@company.com', age: 22, department: 'HR', active: true, joinDate: '2023-06-12', salary: 55000 },
  { id: 6, name: 'Frank Wilson', email: 'frank.wilson@company.com', age: 29, department: 'Engineering', active: true, joinDate: '2022-09-18', salary: 90000 },
];

const departments = ['Engineering', 'Marketing', 'Design', 'Sales', 'HR', 'Finance', 'Operations'];

function App() {
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [department, setDepartment] = useState('');
  const [salary, setSalary] = useState('');
  
  // Validation states
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);

  // Table state
  const [users, setUsers] = useState(initialUsers);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [tableLoading, setTableLoading] = useState(false);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(true);

  // Effect to apply dark mode class to HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Validation function
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!age) newErrors.age = 'Age is required';
    else if (isNaN(Number(age)) || Number(age) < 18 || Number(age) > 100) {
      newErrors.age = 'Age must be between 18 and 100';
    }
    if (!department) newErrors.department = 'Department is required';
    if (!salary) newErrors.salary = 'Salary is required';
    else if (isNaN(Number(salary)) || Number(salary) < 0) {
      newErrors.salary = 'Salary must be a positive number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission with success animation
  const handleAddUser = async () => {
    if (!validateForm()) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    const newUser: User = {
      id: users.length + 1, name, email, age: Number(age), department,
      active: Math.random() > 0.3,
      joinDate: new Date().toISOString().split('T')[0],
      salary: Number(salary),
    };
    setUsers(prev => [...prev, newUser]);
    setName(''); setEmail(''); setAge(''); setDepartment(''); setSalary('');
    setErrors({});
    setLoading(false);
  };

  // Handle input changes with error clearing
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
  };
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAge(e.target.value);
    if (errors.age) setErrors(prev => ({ ...prev, age: '' }));
  };
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalary(e.target.value);
    if (errors.salary) setErrors(prev => ({ ...prev, salary: '' }));
  };
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartment(e.target.value);
    if (errors.department) setErrors(prev => ({ ...prev, department: '' }));
  };

  // Refresh table data
  const handleRefreshData = async () => {
    setTableLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setTableLoading(false);
  };

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Calculate statistics with animation
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.active).length;
  const averageAge = Math.round(users.reduce((sum, u) => sum + u.age, 0) / users.length);
  const averageSalary = Math.round(users.reduce((sum, u) => sum + u.salary, 0) / users.length);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`min-h-screen transition-all duration-500 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}
    >
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="fixed top-10 right-10 w-64 h-64 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="fixed bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-5 blur-3xl"
      />

      {/* Header */}
      <motion.header
        variants={itemVariants}
        className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
          darkMode 
            ? 'bg-gray-900/90 border-gray-700 shadow-2xl' 
            : 'bg-white/90 border-gray-200 shadow-lg'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity }
                }}
                className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <span className="text-white font-bold text-xl">🚀</span>
              </motion.div>
              <div>
                <motion.h1 
                  className={`text-3xl font-bold bg-gradient-to-r ${
                    darkMode 
                      ? 'from-blue-400 to-purple-400' 
                      : 'from-blue-600 to-purple-600'
                  } bg-clip-text text-transparent`}
                >
                  Component Showcase
                </motion.h1>
                <motion.p 
                  className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Beautiful InputField & DataTable Demo with Framer Motion
                </motion.p>
              </div>
            </motion.div>
            
            <div className="flex items-center space-x-6">
              {/* Animated Statistics - Fixed Colors */}
              <div className="hidden md:flex items-center space-x-6">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-center"
                >
                  <motion.div
                    key={totalUsers}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-3xl font-bold ${
                      darkMode ? 'text-blue-300' : 'text-blue-700'
                    }`}
                  >
                    {totalUsers}
                  </motion.div>
                  <div className={`text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Total Users
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-center"
                >
                  <motion.div
                    key={activeUsers}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-3xl font-bold ${
                      darkMode ? 'text-green-300' : 'text-green-700'
                    }`}
                  >
                    {activeUsers}
                  </motion.div>
                  <div className={`text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Active
                  </div>
                </motion.div>
              </div>
              
              {/* Dark mode toggle */}
              <motion.button
                onClick={toggleDarkMode}
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                className={`p-3 rounded-xl transition-all duration-300 shadow-lg ${
                  darkMode 
                    ? 'bg-yellow-500 hover:bg-yellow-400 text-gray-900' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                <motion.span
                  animate={{ rotate: darkMode ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl"
                >
                  {darkMode ? '☀️' : '🌙'}
                </motion.span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        {/* Form Section */}
        <motion.section
          variants={cardVariants}
          whileHover="hover"
          className={`rounded-3xl p-10 shadow-2xl border transition-all duration-300 ${
            darkMode 
              ? 'bg-gray-800/60 border-gray-700 backdrop-blur-sm' 
              : 'bg-white/70 border-gray-200 backdrop-blur-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-10">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className={`text-3xl font-bold mb-3 bg-gradient-to-r ${
                darkMode 
                  ? 'from-purple-400 to-pink-400' 
                  : 'from-purple-600 to-pink-600'
              } bg-clip-text text-transparent`}>
                ✨ Add New Team Member
              </h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-lg`}>
                Fill out the form below to add a new user to the system
              </p>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="hidden sm:block"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                className={`px-6 py-3 rounded-xl shadow-lg ${
                  darkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-50 text-blue-700'
                }`}
              >
                <span className="text-sm font-medium">🛡️ Form Validation Active</span>
              </motion.div>
            </motion.div>
          </div>
          
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Form inputs with stagger animation - Fixed Colors */}
            <motion.div variants={itemVariants} className="col-span-1">
              <InputField
                label="Full Name"
                placeholder="Enter full name"
                value={name}
                onChange={handleNameChange}
                errorMessage={errors.name}
                invalid={!!errors.name}
                loading={loading}
                variant="outlined"
                size="md"
                helperText="This will be displayed in the table"
                darkMode={darkMode}
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="col-span-1">
              <InputField
                label="Email Address"
                placeholder="user@company.com"
                value={email}
                onChange={handleEmailChange}
                errorMessage={errors.email}
                invalid={!!errors.email}
                loading={loading}
                variant="outlined"
                size="md"
                helperText="Work email preferred"
                darkMode={darkMode}
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="col-span-1">
              <InputField
                label="Age"
                placeholder="25"
                value={age}
                onChange={handleAgeChange}
                errorMessage={errors.age}
                invalid={!!errors.age}
                loading={loading}
                variant="outlined"
                size="md"
                helperText="Must be 18-100"
                darkMode={darkMode}
              />
            </motion.div>
            
            {/* Department Dropdown - Fixed Colors */}
            <motion.div variants={itemVariants} className="col-span-1 space-y-2">
              <label className={`block text-sm font-semibold ${
                darkMode ? 'text-gray-100' : 'text-gray-800'
              }`}>
                Department
              </label>
              <motion.select
                whileFocus={{ scale: 1.02 }}
                value={department}
                onChange={handleDepartmentChange}
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                  errors.department
                    ? `border-red-500 focus:border-red-500 focus:ring-red-500 ${
                        darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
                      }`
                    : darkMode
                    ? 'border-gray-600 bg-gray-800 text-gray-100 focus:border-blue-400 focus:ring-blue-400'
                    : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="">Select department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </motion.select>
              {errors.department && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 dark:text-red-400 font-medium"
                >
                  {errors.department}
                </motion.p>
              )}
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Choose the appropriate department
              </p>
            </motion.div>
            
            {/* Salary Input */}
            <motion.div variants={itemVariants} className="col-span-1">
              <InputField
                label="Annual Salary"
                placeholder="75000"
                value={salary}
                onChange={handleSalaryChange}
                errorMessage={errors.salary}
                invalid={!!errors.salary}
                loading={loading}
                variant="outlined"
                size="md"
                helperText="In USD"
                darkMode={darkMode}
              />
            </motion.div>
            
            {/* Add User Button */}
            <motion.div variants={itemVariants} className="col-span-1 flex items-end">
              <motion.button
                onClick={handleAddUser}
                disabled={loading}
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                className={`w-full px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform shadow-xl ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-purple-500/25'
                } text-white`}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center space-x-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Adding...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="add"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center space-x-2"
                    >
                      <span>✨</span>
                      <span>Add User</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Table Section */}
        <motion.section
          variants={cardVariants}
          whileHover="hover"
          className={`rounded-3xl p-10 shadow-2xl border transition-all duration-300 ${
            darkMode 
              ? 'bg-gray-800/60 border-gray-700 backdrop-blur-sm' 
              : 'bg-white/70 border-gray-200 backdrop-blur-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-10">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className={`text-3xl font-bold mb-3 bg-gradient-to-r ${
                darkMode 
                  ? 'from-green-400 to-blue-400' 
                  : 'from-green-600 to-blue-600'
              } bg-clip-text text-transparent`}>
                👥 Team Directory
              </h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-lg`}>
                Manage and view all team members
              </p>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              {/* Fixed Statistics Colors */}
              <div className="hidden sm:flex items-center space-x-4 text-sm">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`px-4 py-2 rounded-xl font-medium ${
                    darkMode ? 'bg-gray-700 text-gray-200 border border-gray-600' : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}
                >
                  📊 Avg Age: {averageAge}
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`px-4 py-2 rounded-xl font-medium ${
                    darkMode ? 'bg-gray-700 text-gray-200 border border-gray-600' : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}
                >
                  💰 Avg Salary: ${averageSalary.toLocaleString()}
                </motion.div>
              </div>
              
              {/* Fixed Refresh Button Colors */}
              <motion.button
                onClick={handleRefreshData}
                disabled={tableLoading}
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                className={`px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg border ${
                  tableLoading
                    ? 'bg-gray-400 cursor-not-allowed border-gray-500'
                    : darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-100 border-gray-600'
                    : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-200'
                }`}
              >
                <motion.span
                  animate={tableLoading ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 1, repeat: tableLoading ? Infinity : 0 }}
                >
                  {tableLoading ? '🔄' : '↻'}
                </motion.span>
                {' '}Refresh
              </motion.button>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <DataTable<User>
              data={users}
              columns={columns}
              selectable
              onRowSelect={setSelectedUsers}
              loading={tableLoading}
              pagination
              pageSize={5}
              size="md"
              striped
              emptyText="No team members found. Add some users to get started! 🚀"
            />
          </motion.div>
          
          <AnimatePresence>
            {selectedUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`mt-8 p-6 rounded-xl border-l-4 shadow-lg ${
                  darkMode 
                    ? 'bg-blue-900/20 border-blue-400 text-blue-300' 
                    : 'bg-blue-50 border-blue-400 text-blue-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <motion.p
                      initial={{ x: -10 }}
                      animate={{ x: 0 }}
                      className="font-semibold text-lg"
                    >
                      🎯 {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-sm mt-1"
                    >
                      {selectedUsers.map(u => u.name).join(', ')}
                    </motion.p>
                  </div>
                  <div className="flex space-x-3">
                    <motion.button
                      variants={buttonVariants}
                      initial="idle"
                      whileHover="hover"
                      whileTap="tap"
                      className={`px-4 py-2 rounded-lg text-sm font-medium shadow-lg border ${
                        darkMode ? 'bg-blue-600 hover:bg-blue-700 border-blue-500' : 'bg-blue-600 hover:bg-blue-700 border-blue-500'
                      } text-white transition-colors`}
                    >
                      📄 Export
                    </motion.button>
                    <motion.button
                      variants={buttonVariants}
                      initial="idle"
                      whileHover="hover"
                      whileTap="tap"
                      className={`px-4 py-2 rounded-lg text-sm font-medium shadow-lg border ${
                        darkMode ? 'bg-red-600 hover:bg-red-700 border-red-500' : 'bg-red-600 hover:bg-red-700 border-red-500'
                      } text-white transition-colors`}
                    >
                      🗑️ Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className={`text-center py-12 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
      >
        <div className="space-y-4">
          <motion.p
            whileHover={{ scale: 1.05 }}
            className="text-lg font-medium"
          >
            Built with using React, TypeScript, TailwindCSS, Storybook & Framer Motion
          </motion.p>
          <motion.div
            variants={containerVariants}
            className="flex justify-center space-x-8 text-sm"
          >
            {[
              { icon: "🚀", text: "Modern Components" },
              { icon: "♿", text: "Fully Accessible" },
              { icon: "📱", text: "Responsive Design" },
              { icon: "🎨", text: "Beautiful UI" },
              { icon: "⚡", text: "Smooth Animations" }
            ].map((item) => (
              <motion.span
                key={item.text}
                variants={itemVariants}
                whileHover={{ scale: 1.1, y: -2 }}
                className="flex items-center space-x-2"
              >
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.footer>
    </motion.div>
  );
}

export default App;

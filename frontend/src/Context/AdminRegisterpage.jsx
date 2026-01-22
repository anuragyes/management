import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from './TheamContext';
import { AdminRegsiter } from '../ApiInstance/Allapis';

const AdminRegister = () => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch('password');



    const onSubmit = async (data) => {
  console.log("🟢 FORM DATA (react-hook-form) 👉", data);

  setLoading(true);
  setError('');
  setSuccess('');

  try {
    console.log("🟡 SENDING PAYLOAD 👉", {
      name: data.name,
      email: data.email,
      employeeId: data.employeeId,
      password: data.password,
    });

    const response = await axios.post(
      AdminRegsiter,
      {
        name: data.name,
        email: data.email,
        employeeId: data.employeeId,
        password: data.password,
      }
    );

    console.log("🟢 BACKEND RESPONSE 👉", response);
    console.log("🟢 RESPONSE DATA 👉", response.data);

    if (response.data.success) {
      console.log("✅ REGISTER SUCCESS");
      setSuccess('Account created successfully! Redirecting to login...');

      setTimeout(() => {
        console.log("➡️ Redirecting to /admin/login");
        navigate('/admin/login');
      }, 2000);

    } else {
      console.warn("⚠️ REGISTER FAILED 👉", response.data.message);
      setError(response.data.message || 'Registration failed');
    }

  } catch (err) {
    console.error("❌ REGISTER ERROR 👉", err);
    console.error("❌ ERROR RESPONSE 👉", err.response);

    setError(
      err.response?.data?.message ||
      'Network error. Please try again.'
    );
  } finally {
    console.log("🔵 FINALLY BLOCK EXECUTED");
    setLoading(false);
  }
};

    return (
        <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`w-full max-w-md p-8 rounded-lg shadow-lg transition-all duration-300 ${theme === 'dark'
                    ? 'bg-gray-800 text-white shadow-gray-900'
                    : 'bg-white text-gray-800 shadow-gray-200'
                }`}>
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Admin Registration</h1>
                    <p className="text-sm opacity-75">Create your administrator account</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 rounded bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            {...register('name', {
                                required: 'Name is required',
                                minLength: { value: 2, message: 'Name must be at least 2 characters' }
                            })}
                            className={`w-full px-4 py-2 rounded-lg border transition-colors ${theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                } ${errors.name ? 'border-red-500' : ''}`}
                            placeholder="Enter your full name"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                            className={`w-full px-4 py-2 rounded-lg border transition-colors ${theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                } ${errors.email ? 'border-red-500' : ''}`}
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Employee ID
                        </label>
                        <input
                            type="text"
                            {...register('employeeId', {
                                required: 'Employee ID is required',
                                minLength: { value: 3, message: 'Employee ID must be at least 3 characters' }
                            })}
                            className={`w-full px-4 py-2 rounded-lg border transition-colors ${theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                } ${errors.employeeId ? 'border-red-500' : ''}`}
                            placeholder="Enter your employee ID"
                        />
                        {errors.employeeId && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.employeeId.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' }
                            })}
                            className={`w-full px-4 py-2 rounded-lg border transition-colors ${theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                } ${errors.password ? 'border-red-500' : ''}`}
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: value => value === password || 'Passwords do not match'
                            })}
                            className={`w-full px-4 py-2 rounded-lg border transition-colors ${theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                } ${errors.confirmPassword ? 'border-red-500' : ''}`}
                            placeholder="Confirm your password"
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${loading
                                ? 'opacity-70 cursor-not-allowed'
                                : 'hover:opacity-90'
                            } ${theme === 'dark'
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Creating Account...
                            </span>
                        ) : (
                            'Create Account'
                        )}
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-sm">
                            Already have an account?{' '}
                            <Link
                                to="/AdminLoginPage"
                                className={`font-medium ${theme === 'dark'
                                        ? 'text-blue-400 hover:text-blue-300'
                                        : 'text-blue-600 hover:text-blue-500'
                                    }`}
                            >
                                Login here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminRegister;
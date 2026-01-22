



import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from './TheamContext';
import { OrgainserLogin } from '../ApiInstance/Allapis';


const OraginserLoginPage = () => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');

        try {
            console.log("done");
            const response = await axios.post(
                OrgainserLogin,
                {
                    email: data.email,
                    employeeId: data.employeeId,
                    password: data.password,
                }
            );

            console.log("this is res", response)

            if (response.data.success) {
                // Store token in localStorage
                localStorage.setItem('OrgainserToken', response.data.token);
                localStorage.setItem('OrgainserData', JSON.stringify(response.data.user));

                navigate('/OrgniserDashboard');
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Network error. Please check your credentials and try again.'
            );
        } finally {
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
                    <h1 className="text-3xl font-bold mb-2">Oraginser Login</h1>
                    <p className="text-sm opacity-75">Sign in to your administrator account</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                                required: 'Employee ID is required'
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
                                required: 'Password is required'
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

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                className={`h-4 w-4 rounded ${theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600'
                                    : 'border-gray-300'
                                    }`}
                            />
                            <label htmlFor="remember" className="ml-2 text-sm">
                                Remember me
                            </label>
                        </div>
                        <Link
                            to="/forgot-password"
                            className={`text-sm ${theme === 'dark'
                                ? 'text-blue-400 hover:text-blue-300'
                                : 'text-blue-600 hover:text-blue-500'
                                }`}
                        >
                            Forgot password?
                        </Link>
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
                                Signing in...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-sm">
                            Don't have an account?{' '}
                            <Link
                                to="/OrganiserRegsiterPage"
                                className={`font-medium ${theme === 'dark'
                                    ? 'text-blue-400 hover:text-blue-300'
                                    : 'text-blue-600 hover:text-blue-500'
                                    }`}
                            >
                                Register here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OraginserLoginPage;
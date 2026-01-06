// pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  GraduationCap,
  Shield,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Key,
  Smartphone
} from 'lucide-react';
import { useTheme } from './TheamContext';


const LoginPage = () => {
  const navigate = useNavigate();
  const { loginStudent, authLoading, theme } = useTheme();

  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'rollNumber'
  const [formData, setFormData] = useState({
    email: '',
    rollNumber: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (loginMethod === 'email') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else {
      if (!formData.rollNumber.trim()) {
        newErrors.rollNumber = 'Roll number is required';
      } else if (!/^[0-9A-Za-z]{10,15}$/.test(formData.rollNumber)) {
        newErrors.rollNumber = 'Enter a valid roll number (10-15 characters)';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Prepare login data based on selected method
      const loginData = loginMethod === 'email'
        ? {
          email: formData.email,
          password: formData.password
        }
        : {
          rollNumber: formData.rollNumber,
          password: formData.password
        };

      const result = await loginStudent(loginData);

      if (result.success) {
        setSuccessMessage('Login successful! Redirecting to dashboard...');

        // Save remember me preference
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('loginMethod', loginMethod);
          if (loginMethod === 'email') {
            localStorage.setItem('savedEmail', formData.email);
          } else {
            localStorage.setItem('savedRollNumber', formData.rollNumber);
          }
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('loginMethod');
          localStorage.removeItem('savedEmail');
          localStorage.removeItem('savedRollNumber');
        }

        // Redirect after 1 second
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: 'Login failed. Please try again.' });
    }
  };

  // Load saved credentials on component mount
  React.useEffect(() => {
    const savedMethod = localStorage.getItem('loginMethod');
    const savedEmail = localStorage.getItem('savedEmail');
    const savedRollNumber = localStorage.getItem('savedRollNumber');

    if (savedMethod && localStorage.getItem('rememberMe') === 'true') {
      setLoginMethod(savedMethod);
      setFormData(prev => ({
        ...prev,
        email: savedEmail || '',
        rollNumber: savedRollNumber || '',
        rememberMe: true
      }));
    }
  }, []);


  const clearForm = () => {
    setFormData({
      email: '',
      rollNumber: '',
      password: '',
      rememberMe: formData.rememberMe // Keep rememberMe preference
    });
    setErrors({});
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark'
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
      : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
      }`}>
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="md:flex">
          {/* Left Side - Illustration */}
          <div className="hidden md:block md:w-2/5 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]"></div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full -translate-x-32 -translate-y-32 opacity-20"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500 rounded-full translate-x-32 translate-y-32 opacity-20"></div>

            <div className="relative z-10 h-full flex flex-col justify-center items-center text-white">
              <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center mb-8 backdrop-blur-sm border border-white/20">
                <Shield size={96} className="opacity-90" />
              </div>

              <h2 className="text-2xl font-bold mb-4 text-center">
                Welcome Back Student!
              </h2>

              <p className="text-blue-100 text-center mb-8 max-w-xs">
                Access your sports dashboard, manage events, and track your progress.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle size={16} className="text-green-300" />
                  </div>
                  <span className="text-sm">Participate in events</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle size={16} className="text-green-300" />
                  </div>
                  <span className="text-sm">Track registrations</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle size={16} className="text-green-300" />
                  </div>
                  <span className="text-sm">Connect with teams</span>
                </div>
              </div>

              <div className="mt-12 text-center">
                <div className="text-xs text-blue-200/60">
                  Secured by Advanced Encryption
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="w-8 h-1 bg-green-400 rounded-full"></div>
                  <div className="w-8 h-1 bg-green-400 rounded-full"></div>
                  <div className="w-8 h-1 bg-green-400 rounded-full"></div>
                  <div className="w-8 h-1 bg-green-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-3/5 p-6 md:p-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-lg">
                  <GraduationCap size={28} className="text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Portal</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Sign in to continue</p>
                </div>
              </div>

              {/* Theme Toggle (if available) */}
              <button
                onClick={() => { }}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {theme === 'dark' ? '🌙' : '☀️'}
                </span>
              </button>
            </div>

            {/* Demo Login Button */}


            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg animate-fade-in">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                  <div>
                    <p className="text-green-700 dark:text-green-300 font-medium">Success!</p>
                    <p className="text-green-600 dark:text-green-400 text-sm">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg animate-shake">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
                  <div>
                    <p className="text-red-700 dark:text-red-300 font-medium">Login Failed</p>
                    <p className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Login Method Selector */}
            <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-1 rounded-lg flex">
              <button
                type="button"
                onClick={() => { setLoginMethod('email'); clearForm(); }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${loginMethod === 'email'
                  ? 'bg-white dark:bg-gray-800 shadow text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Mail size={16} />
                  Login with Email
                </div>
              </button>
              <button
                type="button"
                onClick={() => { setLoginMethod('rollNumber'); clearForm(); }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${loginMethod === 'rollNumber'
                  ? 'bg-white dark:bg-gray-800 shadow text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <BookOpen size={16} />
                  Login with Roll Number
                </div>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email or Roll Number Input */}
              {loginMethod === 'email' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      College Email Address *
                    </div>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.email
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200`}
                    placeholder="yourname@college.edu"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.email}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Use your college registered email address
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} />
                      Roll Number *
                    </div>
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.rollNumber
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200`}
                    placeholder="0501CS221036"
                    style={{ textTransform: 'uppercase' }}
                  />
                  {errors.rollNumber && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.rollNumber}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Enter your college roll number (e.g., 0501CS221036)
                  </p>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <Lock size={16} />
                    Password *
                  </div>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.password
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 pr-12 transition-all duration-200`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.password}
                  </p>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${formData.password.length >= 6 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    <span className={`text-xs ${formData.password.length >= 6 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      Min 6 characters
                    </span>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Remember me on this device
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                {authLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    Sign In to Your Account
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Don't have an account?
                  </span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <Link
                  to="/register"
                  className="inline-block w-full py-3 px-6 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium rounded-lg transition-all duration-300 hover:border-blue-700 dark:hover:border-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Create New Student Account
                </Link>
              </div>


            </form>

            {/* Security Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Shield size={12} />
                  <span>256-bit SSL Encryption</span>
                </div>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex items-center gap-1">
                  <span>🔒</span>
                  <span>GDPR Compliant</span>
                </div>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex items-center gap-1">
                  <span>🛡️</span>
                  <span>Privacy Protected</span>
                </div>
              </div>
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                © {new Date().getFullYear()} College Sports Portal. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
// pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  BookOpen, 
  Trophy,
   Users,
   Award,
   Calendar,
  Eye, 
  EyeOff,
  GraduationCap,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Building,
  ChevronDown
} from 'lucide-react';
import { useTheme } from './TheamContext';


const RegisterPage = () => {
  const navigate = useNavigate();
  const { registerStudent, authLoading, theme } =useTheme();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const colleges = [
    'Rajasthan College of Engineering for Women',
    'University of Rajasthan',
    'JECRC University',
    'Manipal University Jaipur',
    'Amity University Rajasthan',
    'IIM Kota',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Calculate password strength
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 6) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/[0-9]/.test(value)) strength += 1;
      if (/[^A-Za-z0-9]/.test(value)) strength += 1;
      setPasswordStrength(strength);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = 'Roll number is required';
    } else if (!/^[0-9A-Za-z]{10,15}$/.test(formData.rollNumber)) {
      newErrors.rollNumber = 'Enter a valid roll number (10-15 characters)';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (passwordStrength < 2) {
      newErrors.password = 'Password is too weak. Include uppercase, numbers, or special characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const result = await registerStudent(formData);
      
      if (result.success) {
        setSuccessMessage('Registration successful! Redirecting to dashboard...');
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    }
  };

  const getStrengthColor = (strength) => {
    if (strength === 0) return 'bg-gray-300 dark:bg-gray-600';
    if (strength === 1) return 'bg-red-500';
    if (strength === 2) return 'bg-yellow-500';
    if (strength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = (strength) => {
    if (strength === 0) return 'Very Weak';
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    return 'Strong';
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    }`}>
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="md:flex">
          {/* Left Side - Form */}
          <div className="md:w-1/2 p-6 md:p-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-lg">
                  <GraduationCap size={28} className="text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Join as a student</p>
                </div>
              </div>
              <Link 
                to="/login" 
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                Already have account?
              </Link>
            </div>

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
                    <p className="text-red-700 dark:text-red-300 font-medium">Registration Failed</p>
                    <p className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    Full Name *
                  </div>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.name 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                  placeholder="Anurag Pandey"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    Email Address *
                  </div>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.email 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                  placeholder="anurag@gmail.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Roll Number */}
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
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.rollNumber 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
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
                  This will be your unique identifier
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <Smartphone size={16} />
                    Phone Number (Optional)
                  </div>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.phone 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                  placeholder="9876543210"
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.phone}
                  </p>
                )}
              </div>

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
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.password 
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 pr-12`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
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
                
                {/* Password Strength */}
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Password strength:
                      </span>
                      <span className={`text-xs font-medium ${
                        passwordStrength === 0 ? 'text-gray-500' :
                        passwordStrength === 1 ? 'text-red-500' :
                        passwordStrength === 2 ? 'text-yellow-500' :
                        passwordStrength === 3 ? 'text-blue-500' :
                        'text-green-500'
                      }`}>
                        {getStrengthText(passwordStrength)}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((index) => (
                        <div
                          key={index}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            index <= passwordStrength 
                              ? getStrengthColor(passwordStrength)
                              : 'bg-gray-200 dark:bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${formData.password.length >= 6 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        <span className={`text-xs ${formData.password.length >= 6 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          6+ characters
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        <span className={`text-xs ${/[A-Z]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          Uppercase
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        <span className={`text-xs ${/[0-9]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          Number
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${/[^A-Za-z0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        <span className={`text-xs ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          Special char
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.confirmPassword 
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 pr-12`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98] mt-6"
              >
                {authLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Student Account
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              {/* Terms and Conditions */}
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </form>
          </div>

          {/* Right Side - Benefits */}
          <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full translate-x-32 -translate-y-32 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full -translate-x-32 translate-y-32 opacity-20"></div>
            
            <div className="relative z-10 h-full flex flex-col justify-center text-white">
              <div className="mb-8">
                <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                  <Building size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-4">
                  Join Our College Sports Community
                </h2>
                <p className="text-blue-100 mb-8">
                  Create your account to access exclusive sports events and campus activities.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Sports Events</h3>
                    <p className="text-sm text-blue-100/80">Participate in various indoor, outdoor, and e-sports competitions</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Team Building</h3>
                    <p className="text-sm text-blue-100/80">Form teams, connect with players, and collaborate</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Achievements</h3>
                    <p className="text-sm text-blue-100/80">Track your progress and earn certificates & badges</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Event Updates</h3>
                    <p className="text-sm text-blue-100/80">Get real-time notifications about upcoming events</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-100/60">Already registered?</p>
                    <p className="text-lg font-semibold">5000+ Students</p>
                  </div>
                  <Link 
                    to="/login" 
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors text-sm font-medium"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
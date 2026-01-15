import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { 
  Calendar, 
  Trophy, 
  Music, 
  Code, 
  Mic, 
  Wrench, 
  Users, 
  Clock, 
  MapPin, 
  ChevronRight,
  TrendingUp,
  Star,
  Award,
  Sparkles,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import axios from 'axios';
import { useTheme } from '../Context/TheamContext';

const HomePage = () => {
  const { theme } = useTheme(); 
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  // Event categories for filtering
  const categories = [
    { id: 'all', name: 'All Events', icon: '🎯', color: 'from-blue-500 to-cyan-500' },
    { id: 'sports', name: 'Sports', icon: '⚽', color: 'from-red-500 to-orange-500' },
    { id: 'hackathon', name: 'Hackathons', icon: '💻', color: 'from-green-500 to-emerald-500' },
    { id: 'cultural', name: 'Cultural', icon: '🎭', color: 'from-purple-500 to-pink-500' },
    { id: 'seminars', name: 'Seminars', icon: '🎤', color: 'from-yellow-500 to-amber-500' },
    { id: 'workshops', name: 'Workshops', icon: '🔧', color: 'from-indigo-500 to-blue-500' },
  ];

  // Featured event categories with stats
  const featuredCategories = [
    { 
      icon: <Trophy className="w-6 h-6" />, 
      name: 'Sports Events', 
      count: '24 Events', 
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      iconColor: 'text-red-600 dark:text-red-400',
      gradient: 'from-red-500 to-orange-500'
    },
    { 
      icon: <Code className="w-6 h-6" />, 
      name: 'Hackathons', 
      count: '8 Competitions', 
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
      icon: <Music className="w-6 h-6" />, 
      name: 'Cultural Fest', 
      count: '15 Performances', 
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      icon: <Wrench className="w-6 h-6" />, 
      name: 'Workshops', 
      count: '12 Sessions', 
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      gradient: 'from-blue-500 to-cyan-500'
    },
  ];

  // Stats data
  const stats = [
    { value: '500+', label: 'Events Hosted', icon: '🎯' },
    { value: '10K+', label: 'Students Registered', icon: '👥' },
    { value: '50+', label: 'Student Clubs', icon: '🏛️' },
    { value: '98%', label: 'Satisfaction Rate', icon: '⭐' },
  ];

  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Fetch from multiple endpoints
        const endpoints = [
          'http://localhost:5000/api/Event/ESports/getAllsports',
          'http://localhost:5000/api/event/hackathon/getallhackthon',
          'http://localhost:5000/api/event/CuturalEvent/GetCuturalEvent',
          'http://localhost:5000/api/event/seminar/getseminar',
          'http://localhost:5000/api/workshope/event/getworkshop'
        ];

        const responses = await Promise.all(
          endpoints.map(endpoint => axios.get(endpoint))
        );

        const allEvents = responses.flatMap(res => 
          Array.isArray(res.data.data) ? res.data.data : []
        );

        // Get trending events (first 4)
        setTrendingEvents(allEvents.slice(0, 4));
        // Get upcoming events (next 6)
        setUpcomingEvents(allEvents.slice(4, 10));
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Coming Soon';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
      
      {/* Hero Section with Wave Background */}
    <div className="relative overflow-hidden">
  {/* Wave SVG Background */}
  <div className="absolute inset-0 z-0">
    <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path
        fill={theme === 'light' ? "#3b82f6" : "#1e3a8a"}
        fillOpacity="0.12"
        d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L0,320Z"
      />
    </svg>
  </div>

  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
    <div className="text-center">

      {/* Badge */}
      <div
        className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-sm border mb-6
          ${theme === 'light'
            ? 'bg-blue-100 border-blue-200'
            : 'bg-white/10 border-white/20'
          }`}
      >
        <Sparkles
          className={`w-4 h-4 ${theme === 'light' ? 'text-blue-600' : 'text-white'}`}
        />
        <span
          className={`text-sm font-medium ${theme === 'light' ? 'text-blue-800' : 'text-white'}`}
        >
          Official College Platform
        </span>
      </div>

      {/* Heading */}
      <h1
        className={`text-4xl md:text-6xl font-bold mb-6
          ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}
      >
        Discover Amazing
        <span className="block bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
          Campus Events
        </span>
      </h1>

      {/* Description */}
      <p
        className={`text-xl mb-8 max-w-2xl mx-auto
          ${theme === 'light' ? 'text-gray-600' : 'text-white/80'}`}
      >
        Join thousands of students in exciting sports competitions, hackathons,
        cultural festivals, workshops, and seminars across campus.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/events"
          className={`px-8 py-3 font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl
            ${theme === 'light'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-white text-blue-600 hover:bg-gray-100'
            }`}
        >
          Explore Events
          <ArrowRight className="inline-block ml-2 w-5 h-5" />
        </Link>

        <button
          className={`px-8 py-3 border-2 font-semibold rounded-full transition-all duration-300
            ${theme === 'light'
              ? 'border-blue-600 text-blue-600 hover:bg-blue-50'
              : 'border-white text-white hover:bg-white/10'
            }`}
        >
          Host an Event
        </button>
      </div>

      {/* Search Bar */}
      <div className="mt-12 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for events, workshops, or clubs..."
            className={`w-full pl-12 pr-24 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500
              ${theme === 'light'
                ? 'bg-white text-gray-900 shadow-lg'
                : 'bg-gray-800 text-white'
              }`}
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300">
            Search
          </button>
        </div>
      </div>

    </div>
  </div>
</div>


      {/* Main Content */}
      <div className="relative -mt-20">
        {/* Wave Divider */}
        <div className="absolute top-0 left-0 right-0 h-20">
          <svg 
            className="w-full h-full" 
            viewBox="0 0 1440 120" 
            preserveAspectRatio="none"
          >
            <path 
              fill={theme === 'light' ? "#ffffff" : "#111827"} 
              d="M0,0L48,10.7C96,21,192,43,288,48C384,53,480,43,576,37.3C672,32,768,32,864,48C960,64,1056,96,1152,101.3C1248,107,1344,85,1392,74.7L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            ></path>
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`p-6 rounded-2xl ${theme === 'light' 
                  ? 'bg-gray-50 border border-gray-100' 
                  : 'bg-gray-800 border border-gray-700'
                } text-center`}
              >
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className={`flex items-center justify-center space-x-2 ${theme === 'light' 
                  ? 'text-gray-600' 
                  : 'text-gray-300'
                }`}>
                  <span className="text-xl">{stat.icon}</span>
                  <span>{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Event Categories */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Browse by Category</h2>
                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  Discover events that match your interests
                </p>
              </div>
              <Link 
                to="/events" 
                className={`flex items-center space-x-2 ${theme === 'light' 
                  ? 'text-blue-600 hover:text-blue-700' 
                  : 'text-blue-400 hover:text-blue-300'
                }`}
              >
                <span>View All</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`p-4 rounded-xl transition-all duration-300 ${
                    activeCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform -translate-y-1`
                      : theme === 'light'
                      ? 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="font-semibold text-sm">{category.name}</div>
                </button>
              ))}
            </div>
          </div>

        

          {/* Featured Categories */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">What's Happening on Campus</h2>
              <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                Explore different types of campus activities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCategories.map((category, index) => (
                <div 
                  key={index}
                  className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                    theme === 'light'
                      ? 'bg-white border-gray-200 hover:border-blue-200'
                      : 'bg-gray-800 border-gray-700 hover:border-blue-700'
                  }`}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`p-3 rounded-xl ${category.bgColor}`}>
                      <span className={category.iconColor}>{category.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold">{category.name}</h3>
                      <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {category.count}
                      </p>
                    </div>
                  </div>
                  <p className={`mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    {index === 0 && 'Sports tournaments, matches, and athletic competitions'}
                    {index === 1 && 'Coding competitions, tech challenges, and innovation marathons'}
                    {index === 2 && 'Music, dance, drama, and cultural performances'}
                    {index === 3 && 'Skill development sessions and hands-on learning'}
                  </p>
                  <Link 
                    {/* to={`/events?category=${category.name.toLowerCase().split(' ')[0]}`} */}
                    className={`inline-flex items-center space-x-2 ${theme === 'light' 
                      ? 'text-blue-600 hover:text-blue-700' 
                      : 'text-blue-400 hover:text-blue-300'
                    }`}
                  >
                    <span>Explore</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>


          {/* CTA Section with Wave Bottom */}
          <div className="relative overflow-hidden rounded-3xl mb-16">
            {/* Background Gradient with Wave */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600">
              {/* Wave pattern at bottom */}
              <div className="absolute bottom-0 left-0 right-0">
                <svg 
                  className="w-full h-20" 
                  viewBox="0 0 1440 120" 
                  preserveAspectRatio="none"
                >
                  <path 
                    fill="rgba(255,255,255,0.1)" 
                    d="M0,0L48,10.7C96,21,192,43,288,48C384,53,480,43,576,37.3C672,32,768,32,864,48C960,64,1056,96,1152,101.3C1248,107,1344,85,1392,74.7L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
                  ></path>
                </svg>
              </div>
            </div>
            
            <div className="relative z-10 text-center text-white p-12">
              <Award className="w-16 h-16 mx-auto mb-6 text-white/80" />
              <h2 className="text-4xl font-bold mb-4">Ready to Make Your Campus Life Memorable?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Join thousands of students who are already participating in exciting events.
                Register today and be part of the campus community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/events"
                  className="px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300"
                >
                  Browse All Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Design */}
      <div className="relative h-32 -mt-8">
        <svg 
          className="absolute bottom-0 w-full h-full" 
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
        >
          <path 
            fill={theme === 'light' ? "#f3f4f6" : "#111827"} 
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default HomePage;

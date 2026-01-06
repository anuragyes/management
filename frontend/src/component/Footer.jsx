import React from 'react';
import { Link } from 'react-router-dom';

import { 
  Calendar, 
  Users, 
  Trophy, 
  BookOpen, 
  Music, 
  Code, 
  Mic, 
  Wrench,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube
} from 'lucide-react';
import { useTheme } from '../Context/TheamContext';

const Footer = () => {
  const { theme } =  useTheme();
  const currentYear = new Date().getFullYear();

  const eventCategories = [
    { icon: <Trophy className="w-4 h-4" />, name: 'Sports', color: 'text-red-500' },
    { icon: <Code className="w-4 h-4" />, name: 'Hackathons', color: 'text-blue-500' },
    { icon: <Music className="w-4 h-4" />, name: 'Cultural', color: 'text-purple-500' },
    { icon: <Mic className="w-4 h-4" />, name: 'Seminars', color: 'text-green-500' },
    { icon: <Wrench className="w-4 h-4" />, name: 'Workshops', color: 'text-yellow-500' },
    { icon: <BookOpen className="w-4 h-4" />, name: 'Academic', color: 'text-indigo-500' },
  ];

  const quickLinks = [
    { path: '/events', label: 'All Events' },
    { path: '/create-event', label: 'Host Event' },
    { path: '/my-events', label: 'My Registrations' },
    { path: '/calendar', label: 'Event Calendar' },
    { path: '/clubs', label: 'Student Clubs' },
    { path: '/resources', label: 'Resources' },
  ];

  const contactInfo = [
    { icon: <Phone className="w-4 h-4" />, text: '+91 98765 43210', type: 'phone' },
    { icon: <Mail className="w-4 h-4" />, text: 'events@college.edu', type: 'email' },
    { icon: <MapPin className="w-4 h-4" />, text: 'Main Campus, College Road\nCity, State - 123456', type: 'address' },
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, url: '#', label: 'Facebook' },
    { icon: <Twitter className="w-5 h-5" />, url: '#', label: 'Twitter' },
    { icon: <Instagram className="w-5 h-5" />, url: '#', label: 'Instagram' },
    { icon: <Linkedin className="w-5 h-5" />, url: '#', label: 'LinkedIn' },
    { icon: <Youtube className="w-5 h-5" />, url: '#', label: 'YouTube' },
  ];

  return (
    <footer className={`${theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gray-900 text-gray-200'}`}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/30'}`}>
                <Calendar className={`w-6 h-6 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
              </div>
              <div>
                <h2 className="text-xl font-bold">College Events Hub</h2>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Your Campus Event Platform
                </p>
              </div>
            </div>
            <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Discover, register, and host events across campus. Connecting students through memorable experiences.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <Users className={`w-5 h-5 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
              <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                <span className="font-semibold">2,500+</span> Active Students
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className={`flex items-center space-x-2 hover:text-blue-600 transition-colors ${theme === 'light' ? 'text-gray-600 hover:text-blue-600' : 'text-gray-400 hover:text-blue-400'}`}
                  >
                    <span className="text-xs">›</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Event Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Event Categories</h3>
            <div className="grid grid-cols-2 gap-2">
              {eventCategories.map((category, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-2 p-2 rounded-lg ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-800 hover:bg-gray-700'} transition-colors cursor-pointer`}
                >
                  <span className={category.color}>{category.icon}</span>
                  <span className="text-sm">{category.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              {contactInfo.map((contact, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className={`mt-0.5 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {contact.icon}
                  </span>
                  <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {contact.type === 'address' ? (
                      <>
                        Main Campus, College Road<br />
                        City, State - 123456
                      </>
                    ) : contact.text}
                  </span>
                </div>
              ))}
              
              {/* Social Links */}
              <div className="pt-4">
                <div className="flex items-center space-x-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      aria-label={social.label}
                      className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'} transition-colors`}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className={`mt-12 pt-8 border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-800'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Subscribe to get weekly event updates and announcements.
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Your college email"
                className={`flex-1 md:w-64 px-4 py-2 rounded-l-lg border ${theme === 'light' 
                  ? 'bg-white border-gray-300 text-gray-800 placeholder-gray-500' 
                  : 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button className={`px-6 py-2 rounded-r-lg font-semibold ${theme === 'light' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-700 hover:bg-blue-600 text-white'
              } transition-colors`}>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} py-6`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-4 md:mb-0`}>
              © {currentYear} College Events Hub. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a 
                href="/privacy" 
                className={`hover:text-blue-600 transition-colors ${theme === 'light' ? 'text-gray-600 hover:text-blue-600' : 'text-gray-400 hover:text-blue-400'}`}
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className={`hover:text-blue-600 transition-colors ${theme === 'light' ? 'text-gray-600 hover:text-blue-600' : 'text-gray-400 hover:text-blue-400'}`}
              >
                Terms of Service
              </a>
              <a 
                href="/conduct" 
                className={`hover:text-blue-600 transition-colors ${theme === 'light' ? 'text-gray-600 hover:text-blue-600' : 'text-gray-400 hover:text-blue-400'}`}
              >
                Code of Conduct
              </a>
              <a 
                href="/accessibility" 
                className={`hover:text-blue-600 transition-colors ${theme === 'light' ? 'text-gray-600 hover:text-blue-600' : 'text-gray-400 hover:text-blue-400'}`}
              >
                Accessibility
              </a>
            </div>

            {/* College Info */}
            <div className={`text-xs text-center md:text-right mt-4 md:mt-0 ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
              Official Event Management System<br />
              [Your College Name] • Est. {currentYear - 50}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
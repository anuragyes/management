
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../Context/TheamContext';
import {
  Calendar,
  Users,
  Trophy,
  Code,
  BookOpen,
  Music,
  TrendingUp,
  Plus,
  Menu,
  X,
  ChevronRight,
  Clock,
  MapPin,
  Eye,
  Users as UsersIcon,
  Tag,
  Star,
  Filter,
  Search,
  Download,
  Share2,
  ChevronDown,
  MoreVertical,
  AlertCircle
} from 'lucide-react';
import { EventUpcommingCutural, EventUpcommingHackaThon, EventUpcommingSeminar, EventUpcommingSport, EventUpcommingWorkshop, EventUpcommingWorkstartup } from '../../ApiInstance/Allapis';

const CreateEventDropdown = ({ eventTypes }) => {
  // console.log("hgfdsaqwertyhjkl;poiuytfrd",eventTypes)
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const createEventTypes = eventTypes.filter(type => type.formPath);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* MAIN BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className={`group relative flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${theme === 'dark'
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
          } shadow-lg hover:shadow-xl active:scale-95`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Plus size={18} className="transition-transform duration-300 group-hover:rotate-90" />
        <span>Create New Event</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* DROPDOWN MENU */}
      {open && (
        <div
          className={`absolute top-full left-0 mt-2 w-56 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in ${theme === 'dark'
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200'
            }`}
          role="menu"
          aria-orientation="vertical"
        >
          {/* Dropdown header */}
          <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
            <h4 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Select Event Type
            </h4>
            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
              Choose an event type to create
            </p>
          </div>

          {/* Event type options */}
          <div className="py-2 max-h-80 overflow-y-auto">
            {eventTypes.map((type) => (
              <Link
                key={type.id}
                to={type.formPath}
                onClick={() => setOpen(false)}
                className={`group flex items-center gap-3 px-4 py-3 transition-all duration-200 ${theme === 'dark'
                  ? 'hover:bg-gray-700/50 text-gray-300'
                  : 'hover:bg-gray-50 text-gray-700'
                  }`}
                role="menuitem"
              >
                {/* Icon with gradient background */}
                <div className={`p-2 rounded-lg bg-gradient-to-r ${type.color} text-white`}>
                  {type.icon}
                </div>

                {/* Label */}
                <span className="font-medium text-sm flex-1">{type.label}</span>

                {/* Arrow indicator */}
                <ChevronDown
                  size={14}
                  className={`opacity-0 group-hover:opacity-100 transition-all duration-300 rotate-90 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                />
              </Link>
            ))}
          </div>

          {/* Dropdown footer */}
          <div className={`px-4 py-3 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
            }`}>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
              Need help?{' '}
              <Link
                to="/help"
                className={`font-medium hover:underline ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}
                onClick={() => setOpen(false)}
              >
                Contact support
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* Dropdown overlay (for mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/20"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
};



const EventManagementDashboard = () => {

  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // API endpoints
  const API_ENDPOINTS = {
    sports: EventUpcommingSport,
    hackathon: EventUpcommingHackaThon,
    cultural: EventUpcommingCutural,
    seminar: EventUpcommingSeminar,
    workshop: EventUpcommingWorkshop,
    startup: EventUpcommingWorkstartup,
  };

  // Event type configurations
  const eventTypes = [
    {
      id: 'all',
      label: 'All Events',
      icon: <Calendar size={18} />,
      color: 'from-gray-500 to-gray-600',
      apiKey: null
    },
    {
      id: 'sports',
      label: 'Sports Events',
      icon: <Trophy size={18} />,
      color: 'from-blue-500 to-blue-600',
      apiKey: 'sports',
      formPath: '/orgniser/sports'
    },
    {
      id: 'cultural',
      label: 'Cultural Events',
      icon: <Music size={18} />,
      color: 'from-purple-500 to-purple-600',
      apiKey: 'cultural',
      formPath: '/events/create/cultural'
    },
    {
      id: 'hackathon',
      label: 'Hackathon Events',
      icon: <Code size={18} />,
      color: 'from-green-500 to-green-600',
      apiKey: 'hackathon',
      formPath: '/orgniser/createHackathone'
    },
    {
      id: 'seminar',
      label: 'Seminar Events',
      icon: <BookOpen size={18} />,
      color: 'from-yellow-500 to-yellow-600',
      apiKey: 'seminar',
      formPath: '/orgniser/seminar'
    },
    {
      id: 'workshop',
      label: 'Workshop Events',
      icon: <BookOpen size={18} />,
      color: 'from-pink-500 to-pink-600',
      apiKey: 'workshop',
      formPath: '/events/create/workshop'
    },
    {
      id: 'startup',
      label: 'Startup Events',
      icon: <TrendingUp size={18} />,
      color: 'from-orange-500 to-orange-600',
      apiKey: 'startup',
      formPath: '/events/create/startup'
    }
  ];

  // Random images for events (replace with actual images from API)
  const randomImages = [
    'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
    'https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=800&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80'
  ];

  // Fetch all events
  const normalizeArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.transactions)) return data.transactions;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeFilter !== "all") {
        const endpoint = API_ENDPOINTS[activeFilter];
        if (!endpoint) return;

        const response = await axios.get(endpoint);

        setEvents(
          normalizeArray(response.data).map(event => ({
            ...event,
            type: activeFilter,
            image:
              randomImages[Math.floor(Math.random() * randomImages.length)],
          }))
        );
      } else {
        const promises = eventTypes
          .filter(type => type.apiKey && API_ENDPOINTS[type.apiKey])
          .map(async (type) => {
            try {
              const response = await axios.get(API_ENDPOINTS[type.apiKey]);

              return normalizeArray(response.data).map(event => ({
                ...event,
                type: type.apiKey,
                eventTypeLabel: type.label,
                image:
                  randomImages[Math.floor(Math.random() * randomImages.length)],
              }));
            } catch (err) {
              console.error(`Error fetching ${type.label}:`, err);
              return [];
            }
          });

        const results = await Promise.all(promises);
        setEvents(results.flat());
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events.");
      setEvents(generateSampleEvents());
    } finally {
      setLoading(false);
    }
  };

  // Generate sample events for demonstration
  const generateSampleEvents = () => {
    const sampleData = [];
    eventTypes.forEach(type => {
      if (type.apiKey && type.apiKey !== 'all') {
        for (let i = 1; i <= 3; i++) {
          sampleData.push({
            _id: `${type.id}_${i}`,
            title: `${type.label} ${i}`,
            description: `Sample ${type.label} event description ${i}`,
            date: new Date(Date.now() + i * 86400000).toISOString(),
            venue: `Venue ${i}`,
            participants: Math.floor(Math.random() * 100) + 20,
            status: ['upcoming', 'ongoing', 'completed'][Math.floor(Math.random() * 3)],
            type: type.apiKey,
            eventTypeLabel: type.label,
            image: randomImages[Math.floor(Math.random() * randomImages.length)],
            featured: i === 1,
            organizer: 'College Club',
            registrationFee: type.id === 'sports' ? 100 : type.id === 'hackathon' ? 500 : 0
          });
        }
      }
    });
    return sampleData;
  };

  useEffect(() => {
    fetchEvents();
  }, [activeFilter]);

  // Filter events based on search term
  const filteredEvents = events.filter(event => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    return (
      (event.title || event.eventName || '').toLowerCase().includes(term) ||
      (event.description || '').toLowerCase().includes(term) ||
      (event.venue || '').toLowerCase().includes(term) ||
      (event.eventTypeLabel || '').toLowerCase().includes(term)
    );
  });

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: {
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        text: 'Upcoming'
      },
      ongoing: {
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        text: 'Ongoing'
      },
      completed: {
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
        text: 'Completed'
      }
    };

    const config = statusConfig[status] || statusConfig.upcoming;
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  // Get event type config
  const getEventTypeConfig = (type) => {
    return eventTypes.find(t => t.id === type) || eventTypes[0];
  };

  const handleCreateEvent = () => {
    const activeEventType = eventTypes.find(type => type.id === activeFilter);
    if (activeEventType && activeEventType.formPath) {
      window.location.href = activeEventType.formPath;
    } else {
      alert('Please select an event type to create');
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Mobile Header */}
      <div className={`md:hidden fixed top-0 left-0 right-0 z-50 p-4 ${theme === 'dark' ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'
        }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
            <h1 className="text-xl font-bold">Event Manager</h1>
          </div>
          <Link
            to="/events/create"
            className="p-2 rounded-lg bg-blue-600 text-white"
          >
            <Plus size={20} />
          </Link>
        </div>
      </div>

      <div className="flex pt-16 md:pt-0">
        {/* Sidebar - Left 20-30% */}
        <div className={`
          fixed md:relative inset-y-0 left-0 z-40
          transform ${sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}
          transition-transform duration-300 ease-in-out
          w-64 md:w-1/4 lg:w-1/5 xl:w-1/6
          h-screen
          ${theme === 'dark' ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'}
        `}>
          {/* Sidebar Header */}
          <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Calendar size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Event Manager</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">College Events</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="md:hidden p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X size={18} />
              </button>
            </div>
          </div>



          {/* Event Type Navigation */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Event Types
            </h3>
            <nav className="space-y-1">
              {eventTypes.map((event) => (
                <button
                  key={event.id}
                  onClick={() => {
                    setActiveFilter(event.id);
                    if (window.innerWidth < 768) {
                      setSidebarCollapsed(true);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeFilter === event.id
                    ? `bg-gradient-to-r ${event.color} text-white shadow-lg`
                    : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <div className={`p-1.5 rounded ${activeFilter === event.id ? 'bg-white/20' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                    {event.icon}
                  </div>
                  <span className="font-medium">{event.label}</span>
                  {activeFilter === event.id && (
                    <ChevronRight className="ml-auto" size={16} />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Create Event Button */}
          <div className="p-4">
            {/* <Link
              to="/events/create"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Create New Event
            </Link> */}

            <CreateEventDropdown eventTypes={eventTypes} />

          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {sidebarCollapsed && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}

        {/* Main Content Area - Right 70-80% */}
        <div className="flex-1 min-h-screen">
          {/* Content Header */}
          <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${getEventTypeConfig(activeFilter).color
                    }`}>
                    {getEventTypeConfig(activeFilter).icon}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{getEventTypeConfig(activeFilter).label}</h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      {filteredEvents.length} events found
                    </p>
                  </div>
                </div>
              </div>


            </div>
          </div>

          {/* Content Body */}
          <div className="p-4 md:p-6">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">Loading events...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className={`p-6 rounded-xl mb-6 ${theme === 'dark'
                ? 'bg-red-900/20 border border-red-800'
                : 'bg-red-50 border border-red-200'
                }`}>
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
                  <div>
                    <p className="font-medium text-red-700 dark:text-red-300">Error Loading Events</p>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
                    <button
                      onClick={fetchEvents}
                      className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredEvents.length === 0 && (
              <div className={`p-8 rounded-xl text-center ${theme === 'dark'
                ? 'bg-gray-800/50 border border-gray-700'
                : 'bg-white border border-gray-200'
                }`}>
                <Calendar className="mx-auto text-gray-400 dark:text-gray-500" size={48} />
                <h3 className="text-xl font-semibold mt-4">No Events Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  {searchTerm || activeFilter !== 'all'
                    ? 'No events match your criteria.'
                    : 'No events available at the moment.'}
                </p>
                <Link
                  to="/events/create"
                  className="mt-4 inline-block px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-300"
                >
                  Create Your First Event
                </Link>
              </div>
            )}

            {/* Events Grid */}
            {!loading && !error && filteredEvents.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEvents.map((event) => (
                  <div
                    key={event._id || event.id}
                    className={`group relative rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] ${theme === 'dark'
                      ? 'bg-gray-800 border border-gray-700 hover:border-gray-600'
                      : 'bg-white border border-gray-200 hover:border-gray-300'
                      } shadow-lg hover:shadow-2xl`}
                  >
                    {/* Featured Badge */}
                    {event.featured && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">
                          <Star size={10} />
                          Featured
                        </span>
                      </div>
                    )}

                    {/* Event Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title || event.eventName}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Event Type Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getEventTypeConfig(event.type).color.includes('blue') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                          getEventTypeConfig(event.type).color.includes('purple') ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                            getEventTypeConfig(event.type).color.includes('green') ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                              getEventTypeConfig(event.type).color.includes('yellow') ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                getEventTypeConfig(event.type).color.includes('pink') ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400' :
                                  'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                          }`}>
                          {getEventTypeConfig(event.type).icon}
                          {event.eventTypeLabel?.split(' ')[0]}
                        </span>
                      </div>
                    </div>

                    {/* Event Info */}
                    <div className="p-5">
                      {/* Status and Date */}
                      <div className="flex items-center justify-between mb-3">
                        {getStatusBadge(event.status)}
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <Calendar size={14} />
                          {formatDate(event.date)}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-lg mb-2 line-clamp-1">
                        {event.title || event.eventName || 'Untitled Event'}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {event.description || 'No description available'}
                      </p>

                      {/* Details */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin size={14} className="text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-300">
                            {event.venue
                              ? `${event.venue.collegeName}, ${event.venue.hallName}, Room ${event.venue.roomNumber}`
                              : 'Venue TBA'}
                          </span>

                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <UsersIcon size={14} className="text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-300">
                            {event.participants || 0} participants
                          </span>
                        </div>
                        {event.registrationFee > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <Tag size={14} className="text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">
                              ₹{event.registrationFee} registration fee
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/events/upcoming/event/${event._id}`}
                          state={{ event }}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-300 text-sm flex items-center gap-2"
                        >
                          <Eye size={14} />
                          Details
                        </Link>

                        <div className="flex items-center gap-2">
                          <button className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <Share2 size={16} />
                          </button>
                          <button className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}




            {/* Stats Section */}
            <div className={`mt-12 p-6 rounded-xl ${theme === 'dark'
              ? 'bg-gray-800/50 border border-gray-700'
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'
              }`}>
              <h3 className="text-xl font-bold mb-6">Event Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {eventTypes.filter(type => type.apiKey).map((type) => (
                  <div
                    key={type.id}
                    className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-white'
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded ${type.color.includes('blue') ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                        type.color.includes('purple') ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                          type.color.includes('green') ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                            type.color.includes('yellow') ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              type.color.includes('pink') ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' :
                                'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                        }`}>
                        {type.icon}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{type.label}</p>
                        <p className="text-xl font-bold">
                          {events.filter(e => e.type === type.apiKey).length}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManagementDashboard;
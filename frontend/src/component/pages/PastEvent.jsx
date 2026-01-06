

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../Context/TheamContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { EventUpcommingSport, EventUpcommingHackaThon, EventUpcommingCutural, EventUpcommingSeminar, EventUpcommingWorkstartup, EventUpcommingWorkshop } from '../../ApiInstance/Allapis';
const PastEventPage = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryCounts, setCategoryCounts] = useState({
        all: 0,
        sports: 0,
        hackathon: 0,
        cultural: 0,
        seminars: 0,
        workshops: 0,
        startup: 0
    });

    // Event categories with dynamic counts
    const eventCategories = [
        { id: 'all', name: 'All Events', icon: '🎯', count: categoryCounts.all },
        { id: 'sports', name: 'Sports Events', icon: '⚽', count: categoryCounts.sports },
        { id: 'hackathon', name: 'Hackathons', icon: '💻', count: categoryCounts.hackathon },
        { id: 'cultural', name: 'Cultural Events', icon: '🎭', count: categoryCounts.cultural },
        { id: 'seminars', name: 'Seminars', icon: '🎤', count: categoryCounts.seminars },
        { id: 'workshops', name: 'Workshops', icon: '🔧', count: categoryCounts.workshops },
        { id: 'startup', name: 'Startup Events', icon: '🚀', count: categoryCounts.startup },
    ];

    // API endpoints mapping for each category
    const categoryEndpoints = {
        sports: EventUpcommingSport,
        hackathon: EventUpcommingHackaThon,
        cultural: EventUpcommingCutural,
        seminars: EventUpcommingSeminar,
        workshops: EventUpcommingWorkshop,
        startup: EventUpcommingWorkstartup,
    };

    // Function to get image based on category
    const getCategoryImage = (category) => {
        const categoryImages = {
            sports: [
                'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800',
                'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800',
                'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800'
            ],
            hackathon: [
                'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800',
                'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800'
            ],
            cultural: [
                'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800',
                'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800',
                'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800'
            ],
            seminars: [
                'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800',
                'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=800'
            ],
            workshops: [
                'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800',
                'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800',
                'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800'
            ],
            startup: [
                'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800',
                'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800'
            ]
        };

        const images = categoryImages[category] || categoryImages.sports;
        return images[Math.floor(Math.random() * images.length)];
    };

    // Helper function to extract common fields from different event types
    const extractEventData = (event, category) => {
        // Common fields that should be present in all events
        let title = '';
        let date = '';
        let venue = '';
        let participants = 0;
        let registered = 0;
        let status = '';

        switch (category) {
            case 'sports':
                title = event.eventName || event.sportName || 'Sports Event';
                date = event.eventDate || event.createdAt;
                venue = event.venue || 'Venue TBD';
                participants = event.maxParticipants || 0;
                status = event.status || 'Approved';
                break;

            case 'hackathon':
                title = event.title || 'Hackathon';
                date = event.startDate || event.createdAt;
                venue = typeof event.venue === 'object'
                    ? `${event.venue.collegeName || ''} ${event.venue.hallName || ''} ${event.venue.roomNumber || ''}`.trim()
                    : event.venue || 'Venue TBD';
                participants = event.totalTeams || 0;
                status = event.status || 'Approved';
                break;

            case 'cultural':
                title = event.festName || 'Cultural Event';
                date = event.festDate || event.createdAt;
                venue = event.venue || 'Venue TBD';
                status = event.status || 'Draft';
                break;

            case 'seminars':
                title = event.title || event.topic || 'Seminar';
                date = event.date || event.createdAt;
                venue = typeof event.venue === 'object'
                    ? `${event.venue.collegeName || ''} ${event.venue.hallName || ''} ${event.venue.roomNumber || ''}`.trim()
                    : event.venue || 'Venue TBD';
                participants = event.totalSeats || 0;
                status = event.status || 'Approved';
                break;

            case 'workshops':
                title = event.title || 'Workshop';
                date = event.startDate || event.createdAt;
                venue = typeof event.venue === 'object'
                    ? `${event.venue.collegeName || ''} ${event.venue.hallName || ''} ${event.venue.roomNumber || ''}`.trim()
                    : event.venue || 'Venue TBD';
                participants = event.totalSeats || 0;
                status = event.status || 'Approved';
                break;

            case 'startup':
                // Adjust based on your startup API response
                title = event.title || event.name || 'Startup Event';
                date = event.createdAt || '';
                venue = event.location || event.venue || 'Venue TBD';
                status = event.status || 'Active';
                break;

            default:
                title = event.title || event.name || event.eventName || 'Event';
                date = event.date || event.eventDate || event.startDate || event.createdAt || '';
                venue = event.venue || event.location || 'Venue TBD';
                participants = event.participants || event.maxParticipants || event.totalSeats || 0;
                status = event.status || 'Approved';
        }

        return {
            ...event,
            title,
            date,
            venue,
            participants,
            registered: registered || 0,
            status,
            category: category,
            image: getCategoryImage(category)
        };
    };

    // Fetch data for a specific category
    const fetchCategoryData = async (category) => {
        try {
            setLoading(true);
            let allEvents = [];

            const params = { beforeToday: true }; // 🔥 ALWAYS today-based filter

            if (category === 'all') {
                // Fetch all categories
                const promises = Object.entries(categoryEndpoints).map(
                    ([cat, endpoint]) =>
                        axios.get(endpoint, { params }).then(response => ({
                            category: cat,
                            data: response.data.data || response.data
                        }))
                );

                const responses = await Promise.all(promises);

                responses.forEach(response => {
                    const eventsArray = Array.isArray(response.data) ? response.data : [];
                    eventsArray.forEach(event => {
                        allEvents.push(extractEventData(event, response.category));
                    });
                });

            } else {
                // Fetch specific category
                const endpoint = categoryEndpoints[category];
                const response = await axios.get(endpoint, { params });

                const eventsArray = response.data.data || response.data || [];
                eventsArray.forEach(event => {
                    allEvents.push(extractEventData(event, category));
                });
            }

            setEvents(allEvents);
        } catch (error) {
            console.error(`Error fetching ${category} events:`, error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch category counts on initial load
    const fetchCategoryCounts = async () => {
        try {
            const counts = { ...categoryCounts };

            // Fetch count for each category
            for (const [category, endpoint] of Object.entries(categoryEndpoints)) {
                try {
                    const response = await axios.get(endpoint);
                    const data = response.data;
                    const eventsArray = data.data || data || [];
                    counts[category] = Array.isArray(eventsArray) ? eventsArray.length : 0;
                } catch (error) {
                    console.error(`Error fetching ${category} count:`, error);
                    counts[category] = 0;
                }
            }

            // Calculate total count
            counts.all = Object.values(counts).reduce((sum, count) => sum + count, 0);

            setCategoryCounts(counts);
        } catch (error) {
            console.error('Error fetching category counts:', error);
        }
    };

    useEffect(() => {
        fetchCategoryCounts();
    }, []);

    useEffect(() => {
        fetchCategoryData(selectedCategory);
    }, [selectedCategory]);

    const getStatusBadgeColor = (status) => {
        if (!status) return 'bg-gray-100 text-gray-800';

        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'approved':
            case 'upcoming':
                return 'bg-blue-100 text-blue-800';
            case 'ongoing':
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'completed':
            case 'closed':
                return 'bg-gray-100 text-gray-800';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Date TBD';
        try {
            const date = new Date(dateString);
            const options = { weekday: 'short', month: 'short', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        } catch (error) {
            return 'Date TBD';
        }
    };

    const formatTime = (event) => {
        // Check for different time fields based on event type
        if (event.timing) return event.timing;
        if (event.time) return event.time;
        // return 'Time TBD';
    };

    const getCategoryDisplayName = (category) => {
        const categoryMap = {
            sports: 'Sports',
            hackathon: 'Hackathon',
            cultural: 'Cultural',
            seminars: 'Seminar',
            workshops: 'Workshop',
            startup: 'Startup'
        };
        return categoryMap[category] || 'Event';
    };

    const handleRegister = async (event) => {
        console.log("done");
    };

    const handleViewDetails = (eventId) => {

        // try {
        //     navigate(`event/${eventId}`);
        // } catch (error) {
        //     console.error('Error registering for event:', error);
        //     toast.error('Registration failed. Please try again.');
        // }

    };

    return (
        <div className={`min-h-screen transition-all duration-300 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
            {/* Header */}
            <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} shadow-sm`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                                <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                    Past Events
                                </h1>
                                <p className={`mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                    Discover and register for exciting college events
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar - 20% width */}
                    <div className="lg:w-1/5">
                        <div className={`rounded-xl shadow-lg overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                            <div className={`p-4 border-b ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                                <h2 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                                    Event Categories
                                </h2>
                                <p className={`text-sm mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Filter by event type
                                </p>
                            </div>
                            <div className="p-2">
                                {eventCategories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg mb-1 transition-all duration-200 ${selectedCategory === category.id
                                            ? theme === 'light'
                                                ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
                                                : 'bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-700'
                                            : theme === 'light'
                                                ? 'hover:bg-gray-50'
                                                : 'hover:bg-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-xl">{category.icon}</span>
                                            <span className={`font-medium ${selectedCategory === category.id
                                                ? theme === 'light'
                                                    ? 'text-blue-700'
                                                    : 'text-blue-200'
                                                : theme === 'light'
                                                    ? 'text-gray-700'
                                                    : 'text-gray-200'
                                                }`}>
                                                {category.name}
                                            </span>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${selectedCategory === category.id
                                            ? 'bg-white text-blue-600'
                                            : theme === 'light'
                                                ? 'bg-gray-100 text-gray-700'
                                                : 'bg-gray-700 text-gray-300'
                                            }`}>
                                            {category.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area - 80% width */}
                    <div className="lg:w-4/5">
                        {/* Category Header */}
                        <div className={`rounded-xl shadow-lg p-6 mb-6 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div>
                                    <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                        {eventCategories.find(cat => cat.id === selectedCategory)?.name}
                                    </h2>
                                    <p className={`mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                        {selectedCategory === 'all'
                                            ? 'All upcoming events across all categories'
                                            : `All ${selectedCategory} events happening in our college`}
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Events Grid */}
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : events.length === 0 ? (
                            <div className={`text-center py-12 rounded-xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                                <div className="text-6xl mb-4">📅</div>
                                <h3 className={`text-xl font-semibold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                                    No events found
                                </h3>
                                <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                                    There are no events in this category at the moment.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {events.map((event, index) => (
                                    <div key={event._id || event.id || index} className={`rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                                        {/* Event Image */}
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(event.status)}`}>
                                                    {(event.status || 'Approved').charAt(0).toUpperCase() + (event.status || '').slice(1)}
                                                </span>
                                            </div>
                                            <div className="absolute top-3 right-3">
                                                <span className="px-3 py-1 rounded-full bg-black bg-opacity-70 text-white text-xs font-semibold">
                                                    {getCategoryDisplayName(event.category)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Event Content */}
                                        <div className="p-5">
                                            <h3 className={`text-lg font-bold mb-2 line-clamp-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                                {event.title}
                                            </h3>

                                            <div className="space-y-3 mb-4">
                                                <div className="flex items-center space-x-2">
                                                    <span className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                        📅
                                                    </span>
                                                    <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                                        {formatDate(event.date)} • {formatTime(event)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                        📍
                                                    </span>
                                                    <span className={`text-sm line-clamp-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                                        {event.venue || 'Venue TBD'}
                                                    </span>
                                                </div>
                                                {event.participants > 0 && (
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                            👥
                                                        </span>
                                                        <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                                            {event.participants} {event.participants === 1 ? 'seat' : 'seats'} available
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => handleRegister(event._id || event.id)}
                                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                                                >
                                                    Register Now
                                                </button>
                                                <button
                                                    onClick={() => handleViewDetails(event._id || event.id)}
                                                    className={`px-4 py-2 rounded-lg font-medium ${theme === 'light'
                                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                        }`}
                                                >
                                                    Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PastEventPage;
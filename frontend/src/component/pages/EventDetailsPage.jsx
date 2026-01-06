

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../Context/TheamContext';
import { toast } from 'react-toastify'; // Optional: for better notifications
import { EventDetailsPageCutural, EventDetailsPageHackathon, EventDetailsPageRegister, EventDetailsPageSeminar, EventDetailsPageSimilar, EventDetailsPageSports, EventDetailsPageStartup, EventDetailsPageWorkshop } from '../../ApiInstance/Allapis';

const EventDetailsPage = () => {
    const { theme } = useTheme();
    const { eventId, category } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [similarEvents, setSimilarEvents] = useState([]);
    const [registering, setRegistering] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

   

    // API endpoints
    const API_ENDPOINTS = {
        sports: EventDetailsPageSports,
        hackathon: EventDetailsPageHackathon,
        cultural: EventDetailsPageCutural,
        seminars: EventDetailsPageSeminar,
        workshops: EventDetailsPageWorkshop,

        startup: EventDetailsPageStartup,
        register: EventDetailsPageRegister,
        similar: EventDetailsPageSimilar,
    };

    useEffect(() => {
        fetchEventDetails();
        fetchSimilarEvents();
    }, [eventId, category]);

    const fetchEventDetails = async () => {
        setLoading(true);
        try {
            const endpoint = API_ENDPOINTS[category];
            if (!endpoint) {
                throw new Error(`Invalid category: ${category}`);
            }

            const response = await fetch(`${endpoint}/${eventId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("response the data ", response.
                registrationFee);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setEvent(data);
        } catch (error) {
            console.error('Error fetching event details:', error);
            toast.error('Failed to load event details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchSimilarEvents = async () => {
        try {
            const response = await fetch(`${API_ENDPOINTS.similar}/${category}/${eventId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setSimilarEvents(data);
            }
        } catch (error) {
            console.error('Error fetching similar events:', error);
        }
    };

    const handleRegister = async () => {
        setRegistering(true);
        try {
            const userId = localStorage.getItem('userId') || 'current-user-id';

            const response = await fetch(API_ENDPOINTS.register, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    eventId: eventId,
                    category: category,
                    userId: userId,
                    eventTitle: event.title
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setRegistrationSuccess(true);
                // Update event data to reflect new registration count
                if (event) {
                    setEvent({
                        ...event,
                        registeredParticipants: event.registeredParticipants + 1
                    });
                }

                toast.success('Registration successful!');

                // Show success message for 3 seconds
                setTimeout(() => {
                    setRegistrationSuccess(false);
                }, 3000);
            } else {
                throw new Error(result.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration failed:', error);
            toast.error(error.message || 'Registration failed. Please try again.');
        } finally {
            setRegistering(false);
        }
    };

    // Helper functions
    const formatDate = (dateString) => {
        if (!dateString) return 'Date not specified';
        try {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('en-US', options);
        } catch (error) {
            return dateString;
        }
    };

    const getCategoryIcon = (cat) => {
        const icons = {
            sports: '⚽',
            hackathon: '💻',
            cultural: '🎭',
            seminars: '🎤',
            workshops: '🔧',
            startup: '🚀'
        };
        return icons[cat] || '🎯';
    };

    const getCategoryColor = (cat) => {
        const colors = {
            sports: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            hackathon: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            cultural: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            seminars: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            workshops: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
            startup: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
        return colors[cat] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    };

    const handleShare = async () => {
        const shareData = {
            title: event?.title,
            text: event?.description,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            toast.info('Link copied to clipboard!');
        }
    };

    const handleSaveEvent = async () => {
        // try {
        //     const response = await fetch(`${API_BASE_URL}/events/save`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${localStorage.getItem('token')}`
        //         },
        //         body: JSON.stringify({
        //             eventId: eventId,
        //             category: category
        //         })
        //     });

        //     if (response.ok) {
        //         toast.success('Event saved successfully!');
        //     }
        // } catch (error) {
        //     console.error('Error saving event:', error);
        //     toast.error('Failed to save event.');
        // }
    };

    const handleGetDirections = () => {
        if (event?.venue) {
            const address = encodeURIComponent(`${event.venue}, ${event.location}`);
            window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className={`mt-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Loading event details...</p>
                </div>
            </div>
        );
    }

    // Event not found state
    if (!event) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h1 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Event Not Found</h1>
                    <p className={`mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>The event you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/events')}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                        Browse Events
                    </button>
                </div>
            </div>
        );
    }

    // Default image if none provided
    const defaultImage = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200';
    const eventImage = event.image || defaultImage;

    return (
        <div className={`min-h-screen transition-all duration-300 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
            {/* Header with Back Button */}
            <div className={`sticky top-0 z-40 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} shadow-sm`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate(-1)}
                                className={`p-2 rounded-lg ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}`}
                            >
                                ← Back
                            </button>
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">{getCategoryIcon(category)}</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(category)}`}>
                                    {category?.charAt(0).toUpperCase() + category?.slice(1)} Event
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleShare}
                                className={`px-4 py-2 rounded-lg font-medium ${theme === 'light'
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                            >
                                Share
                            </button>
                            <button
                                onClick={handleSaveEvent}
                                className={`px-4 py-2 rounded-lg font-medium ${theme === 'light'
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Main Event Info */}
                    <div className="lg:w-2/3">
                        {/* Event Header */}
                        <div className={`rounded-2xl shadow-xl overflow-hidden mb-8 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                            <div className="relative h-96">
                                <img
                                    src={eventImage}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = defaultImage;
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <h1 className={`text-4xl font-bold mb-4 text-white`}>
                                        {event.title}
                                    </h1>
                                    <p className={`text-xl mb-6 text-gray-200`}>
                                        {event.description}
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                                            <span className="text-white">📅</span>
                                            <span className="text-white font-semibold">{formatDate(event.date)}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                                            <span className="text-white">⏰</span>
                                            <span className="text-white font-semibold">
                                                {event.startTime || 'TBD'} - {event.endTime || 'TBD'}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                                            <span className="text-white">📍</span>
                                            <span className="text-white font-semibold">{event.venue || 'Venue TBD'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Information */}
                        <div className={`rounded-2xl shadow-xl overflow-hidden mb-8 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                            <div className="p-8">
                                <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                                    Event Details
                                </h2>

                                {event.detailedDescription ? (
                                    <div className="prose max-w-none"
                                        dangerouslySetInnerHTML={{ __html: event.detailedDescription }}
                                    />
                                ) : (
                                    <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                                        {event.description}
                                    </p>
                                )}

                                {/* Rules & Requirements */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                    {event.rules && event.rules.length > 0 && (
                                        <div className={`p-6 rounded-xl ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20'}`}>
                                            <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-blue-800' : 'text-blue-200'}`}>
                                                📋 Rules & Guidelines
                                            </h3>
                                            <ul className="space-y-2">
                                                {event.rules.map((rule, index) => (
                                                    <li key={index} className={`flex items-start space-x-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                                        <span className="mt-1">•</span>
                                                        <span>{rule}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {event.requirements && event.requirements.length > 0 && (
                                        <div className={`p-6 rounded-xl ${theme === 'light' ? 'bg-green-50' : 'bg-green-900/20'}`}>
                                            <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-green-800' : 'text-green-200'}`}>
                                                🎒 What to Bring
                                            </h3>
                                            <ul className="space-y-2">
                                                {event.requirements.map((item, index) => (
                                                    <li key={index} className={`flex items-start space-x-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                                        <span className="mt-1">•</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Gallery */}
                                {event.gallery && event.gallery.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                                            Event Gallery
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {event.gallery.map((img, index) => (
                                                <div key={index} className="rounded-lg overflow-hidden">
                                                    <img
                                                        src={img}
                                                        alt={`Gallery ${index + 1}`}
                                                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            e.target.src = defaultImage;
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sponsors Section */}
                        {event.sponsors && event.sponsors.length > 0 && (
                            <div className={`rounded-2xl shadow-xl p-8 mb-8 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                                <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                                    Our Sponsors
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {event.sponsors.map((sponsor, index) => (
                                        <div
                                            key={index}
                                            className={`p-6 rounded-xl text-center ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'}`}
                                        >
                                            {sponsor.logo ? (
                                                <div className="h-16 flex items-center justify-center mb-4">
                                                    <img
                                                        src={sponsor.logo}
                                                        alt={sponsor.name}
                                                        className="max-h-full max-w-full object-contain"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.parentElement.innerHTML = `<span class="text-2xl">🏢</span>`;
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="h-16 flex items-center justify-center mb-4">
                                                    <span className="text-2xl">🏢</span>
                                                </div>
                                            )}
                                            <h4 className={`font-semibold mb-1 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                                                {sponsor.name}
                                            </h4>
                                            {sponsor.type && (
                                                <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                                    {sponsor.type}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Registration & Quick Info */}
                    <div className="lg:w-1/3">
                        {/* Registration Card */}
                        <div className={`sticky top-24 rounded-2xl shadow-xl overflow-hidden mb-8 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                            <div className="p-6">
                                <h2 className={`text-xl font-bold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                                    Register Now
                                </h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>Status</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${event.status === 'upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                            event.status === 'ongoing' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                            }`}>
                                            {event.status ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : 'TBD'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>Entry Fee</span>
                                        <span className={`font-bold ${(!event.entryFee || event.entryFee === 'Free') ? 'text-green-600' : 'text-blue-600'}`}>
                                            {event.entryFee || 'Free'}
                                        </span>
                                    </div>

                                    {event.prizePool && (
                                        <div className="flex justify-between items-center">
                                            <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>Prize Pool</span>
                                            <span className="font-bold text-purple-600">{event.prizePool}</span>
                                        </div>
                                    )}

                                    {event.maxParticipants && (
                                        <div className="flex justify-between items-center">
                                            <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>Seats Available</span>
                                            <span className="font-bold text-blue-600">
                                                {event.maxParticipants - (event.registeredParticipants || 0)} / {event.maxParticipants}
                                            </span>
                                        </div>
                                    )}

                                    {event.registrationDeadline && (
                                        <div className="flex justify-between items-center">
                                            <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>Registration Deadline</span>
                                            <span className="font-medium">{formatDate(event.registrationDeadline)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Progress Bar */}
                                {event.maxParticipants && (
                                    <div className="mb-6">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                                                Registration Progress
                                            </span>
                                            <span className="font-semibold text-blue-600">
                                                {Math.round(((event.registeredParticipants || 0) / event.maxParticipants) * 100)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${Math.min(((event.registeredParticipants || 0) / event.maxParticipants) * 100, 100)}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Register Button */}
                                <button
                                    onClick={handleRegister}
                                    disabled={registering || !event.isRegistrationOpen}
                                    className={`w-full py-3 rounded-lg font-bold text-lg transition-all duration-300 ${event.isRegistrationOpen
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-1'
                                        : 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {registering ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Processing...
                                        </div>
                                    ) : event.isRegistrationOpen ? (
                                        'Register Now'
                                    ) : (
                                        'Registration Closed'
                                    )}
                                </button>

                                {!event.isRegistrationOpen && event.registrationDeadline && (
                                    <p className="text-center text-sm text-red-500 mt-2">
                                        Registration closed on {formatDate(event.registrationDeadline)}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Quick Info Card */}
                        <div className={`rounded-2xl shadow-xl p-6 mb-8 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                            <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                                📍 Location Details
                            </h3>
                            <div className="space-y-3">
                                {(event.venue || event.location) && (
                                    <div className="flex items-start space-x-3">
                                        <span className="text-gray-500 mt-1">🏛️</span>
                                        <div>
                                            <p className="font-medium">{event.venue || 'Venue'}</p>
                                            <p className="text-sm text-gray-500">{event.location || 'Location to be announced'}</p>
                                        </div>
                                    </div>
                                )}

                                {(event.contactPhone || event.contactEmail) && (
                                    <div className="flex items-start space-x-3">
                                        <span className="text-gray-500 mt-1">📞</span>
                                        <div>
                                            <p className="font-medium">Contact</p>
                                            {event.contactPhone && (
                                                <p className="text-sm text-gray-500">{event.contactPhone}</p>
                                            )}
                                            {event.contactEmail && (
                                                <p className="text-sm text-gray-500">{event.contactEmail}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {event.organizer && (
                                    <div className="flex items-start space-x-3">
                                        <span className="text-gray-500 mt-1">👨‍💼</span>
                                        <div>
                                            <p className="font-medium">Organizer</p>
                                            <p className="text-sm text-gray-500">{event.organizer}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleGetDirections}
                                disabled={!event.venue && !event.location}
                                className={`w-full mt-4 py-2 rounded-lg font-medium transition-colors ${theme === 'light'
                                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                    } ${(!event.venue && !event.location) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Get Directions
                            </button>
                        </div>

                        {/* Similar Events */}
                        {similarEvents.length > 0 && (
                            <div className={`rounded-2xl shadow-xl p-6 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                                <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                                    Similar Events
                                </h3>
                                <div className="space-y-4">
                                    {similarEvents.map((similarEvent) => (
                                        <Link
                                            key={similarEvent.id}
                                            to={`/events/${category}/${similarEvent.id}`}
                                            className={`block p-4 rounded-xl transition-all duration-300 hover:shadow-lg ${theme === 'light'
                                                ? 'bg-gray-50 hover:bg-gray-100'
                                                : 'bg-gray-700 hover:bg-gray-600'
                                                }`}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <span className="text-2xl">{getCategoryIcon(category)}</span>
                                                <div>
                                                    <h4 className={`font-semibold mb-1 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                                                        {similarEvent.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {formatDate(similarEvent.date)} • {similarEvent.venue || 'Venue TBD'}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <Link
                                    to={`/events?category=${category}`}
                                    className="block text-center mt-4 text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    View all {category} events →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsPage;
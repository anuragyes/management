import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../Context/TheamContext';
import axios from 'axios';
import { Calendar, MapPin, IndianRupee, Users, Phone, Clock, Award, User, FileText, Tag, CalendarCheck } from 'lucide-react';
import { ByEventIdCutural, ByEventIdHackathone, ByEventIdSeminar, ByEventIdSport, ByEventIdStartup, ByEventIdWorkShpo } from '../../ApiInstance/Allapis';

const SportEventDetailsPage = () => {
    const { id } = useParams();

    console.log("this is details page ", id);
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registerLoading, setRegisterLoading] = useState(false);

    // API endpoints for different event types
    const eventTypeEndpoints = {
        sports: `${ByEventIdSport}/${id}`,
        hackathon: `${ByEventIdHackathone}/${id}`,
        cultural: `${ByEventIdCutural}/${id}`,
        seminars: `${ByEventIdSeminar}/${id}`,
        workshops: `${ByEventIdWorkShpo}/${id}`,
        startup: `${ByEventIdStartup}/${id}`
    };


    const fetchEventData = async () => {
        setLoading(true);
        setError(null);

        for (const [type, endpoint] of Object.entries(eventTypeEndpoints)) {
            try {
                console.log(`Trying ${type} endpoint:`, endpoint);

                const response = await axios.get(endpoint);

                console.log(`${type} response:`, response.data.data.
                    registrationFee
                );

                if (response.data?.success && response.data?.data) {
                    const eventData = {
                        ...response.data.data,
                        eventTypeCategory: type,
                    };

                    setEvent(eventData);
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.log(`Not found in ${type}`);
            }
        }

        setError("Event not found");
        setLoading(false);
    };


    useEffect(() => {
        if (id) {
            fetchEventData();
        }
    }, [id]);

    // const handleRegister = async () => {
    //     try {
    //         setRegisterLoading(true);
    //         // Implement registration API call here
    //         alert('Registration functionality would be implemented here!');
    //         // Example: await axios.post(`/api/event/register/${id}`, { userId: user.id });
    //     } catch (error) {
    //         alert('Registration failed. Please try again.');
    //     } finally {
    //         setRegisterLoading(false);
    //     }
    // };













    const handleRegister = () => {
        setRegisterLoading(true);

        navigate("/register", {
            state: {
                eventId: event._id,
                registrationFee: event.registrationFee,
                category: event.category,
                sportName: event.sportName,
                eventType: event.eventType, // "Solo" / "Team"
                eventTitle: event.title,
                mode: event.mode
            }
        });

        setRegisterLoading(false);
    };

    const handleBack = () => {
        navigate('/events');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'Not specified';
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return '';
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
            case 'upcoming':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'ongoing':
            case 'active':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'completed':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getEventTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'solo': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'team': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'group': return 'bg-pink-100 text-pink-800 border-pink-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getCategoryImage = (category) => {
        const categoryImages = {
            'sports': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200',
            'indoor sports': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200',
            'hackathon': 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200',
            'cultural': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200',
            'seminar': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200',
            'workshop': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200',
            'startup': 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200'
        };

        const key = category?.toLowerCase() || 'sports';
        return categoryImages[key] || categoryImages.sports;
    };

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

    if (error || !event) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="text-6xl mb-4">📅</div>
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                        {error || 'Event Not Found'}
                    </h2>
                    <p className={`mb-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                        The event you're looking for doesn't exist or has been removed.
                    </p>
                    <button
                        onClick={handleBack}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-all duration-300 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
            {/* Header */}
            <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} shadow-sm`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleBack}
                                    className={`p-2 rounded-lg ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
                                >
                                    ← Back
                                </button>
                                <div>
                                    <h1 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                        Event Details
                                    </h1>
                                    <p className={`mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                        Complete information about the event
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button onClick={() => navigate('/orgniser/history')} className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(event.status)} border`}>
                                    View History Payment
                                </button>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(event.status)} border`}>
                                    {event.status || 'Active'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Event Image and Basic Info */}
                    <div className="lg:col-span-2">
                        {/* Event Image */}
                        <div className="rounded-2xl overflow-hidden shadow-xl mb-8">
                            <img
                                src={getCategoryImage(event.category || event.eventTypeCategory)}
                                alt={event.eventName || event.title}
                                className="w-full h-96 object-cover"
                            />
                        </div>

                        {/* Event Details Card */}
                        <div className={`rounded-2xl shadow-lg overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} mb-8`}>
                            <div className="p-8">
                                <div className="flex flex-col md:flex-row md:items-start justify-between mb-8">
                                    <div>
                                        <h2 className={`text-3xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                            {event.eventName || event.title || event.festName || 'Untitled Event'}
                                        </h2>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getEventTypeColor(event.eventType)} border`}>
                                                <Tag className="inline-block w-4 h-4 mr-1" />
                                                {event.eventType || 'Event'}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${theme === 'light' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-900 text-blue-100 border-blue-700'} border`}>
                                                <Award className="inline-block w-4 h-4 mr-1" />
                                                {event.category || event.eventTypeCategory?.charAt(0).toUpperCase() + event.eventTypeCategory?.slice(1) || 'Category'}
                                            </span>
                                            {event.sportName && (
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${theme === 'light' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-green-900 text-green-100 border-green-700'} border`}>
                                                    ⚽ {event.sportName}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0">
                                        <div className={`text-3xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                                            {event.feeAmount === 0 || event.registrationFee === 'Free' ? 'Free' : `₹${event.feeAmount || '0'}`}
                                        </div>
                                        <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Registration Fee</div>
                                    </div>
                                </div>

                                {/* Event Description */}
                                <div className="mb-8">
                                    <h3 className={`text-xl font-semibold mb-4 flex items-center ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                                        <FileText className="w-5 h-5 mr-2" />
                                        About the Event
                                    </h3>
                                    <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} leading-relaxed`}>
                                        {event.description || event.matchRules || 'No description available.'}
                                    </p>
                                </div>

                                {/* Rules/Additional Info */}
                                {(event.matchRules || event.rules || event.problemStatements) && (
                                    <div className="mb-8">
                                        <h3 className={`text-xl font-semibold mb-4 flex items-center ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                                            📝 {event.eventTypeCategory === 'hackathon' ? 'Problem Statements & Rules' : 'Rules & Guidelines'}
                                        </h3>
                                        <div className={`${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'} rounded-lg p-6`}>
                                            {event.eventTypeCategory === 'hackathon' ? (
                                                <div>
                                                    <h4 className={`font-semibold mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>Problem Statements:</h4>
                                                    <ul className={`list-disc pl-5 mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                                        {(event.problemStatements || []).map((statement, index) => (
                                                            <li key={index} className="mb-1">{statement}</li>
                                                        ))}
                                                    </ul>
                                                    <h4 className={`font-semibold mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>Rules:</h4>
                                                    <ul className={`list-disc pl-5 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                                        {(event.rules || []).map((rule, index) => (
                                                            <li key={index} className="mb-1">{rule}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : (
                                                <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                                                    {event.matchRules || event.rules}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Registration and Details */}
                    <div className="space-y-6">
                        {/* Registration Card */}
                        <div className={`rounded-2xl shadow-lg overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                            <div className="p-6">
                                <h3 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                    Register Now
                                </h3>

                                {/* Event Timeline */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-start">
                                        <CalendarCheck className={`w-5 h-5 mt-0.5 mr-3 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
                                        <div>
                                            <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Event Date & Time</div>
                                            <div className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                                                {formatDate(event.eventDate || event.startDate || event.date)}
                                                {formatTime(event.eventDate || event.startDate || event.date) && ` at ${formatTime(event.eventDate || event.startDate || event.date)}`}
                                            </div>
                                        </div>
                                    </div>

                                    {event.registrationDeadline && (
                                        <div className="flex items-start">
                                            <Clock className={`w-5 h-5 mt-0.5 mr-3 ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`} />
                                            <div>
                                                <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Registration Closes</div>
                                                <div className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                                                    {formatDateTime(event.registrationDeadline)}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start">
                                        <Users className={`w-5 h-5 mt-0.5 mr-3 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
                                        <div>
                                            <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Available Slots</div>
                                            <div className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                                                {event.maxParticipants || event.totalSeats || event.totalTeams || 'Unlimited'} spots
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <IndianRupee className={`w-5 h-5 mt-0.5 mr-3 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
                                        <div>
                                            <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>RegistrationFee</div>
                                            <div className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                                                <span className="flex items-center gap-1">
                                                    <IndianRupee className="w-4 h-4" />
                                                    {event.registrationFee ?? 'Free'}
                                                </span>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleRegister}
                                    disabled={registerLoading}
                                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${registerLoading
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                                        } text-white`}
                                >
                                    {registerLoading ? 'Processing...' : 'Register Now'}
                                </button>

                                <p className={`text-xs text-center mt-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    By registering, you agree to our terms and conditions
                                </p>
                            </div>
                        </div>

                        {/* Venue & Coordinator Card */}
                        <div className={`rounded-2xl shadow-lg overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                            <div className="p-6">
                                <h3 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                    Event Information
                                </h3>

                                <div className="space-y-4">
                                    {/* Venue */}
                                    <div>
                                        <div className="flex items-start mb-2">
                                            <MapPin className={`w-5 h-5 mt-0.5 mr-3 ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`} />
                                            <div>
                                                <div className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>Venue</div>
                                                <div className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                                                    {typeof event.venue === 'object'
                                                        ? `${event.venue.collegeName || ''} ${event.venue.hallName || ''} ${event.venue.roomNumber || ''}`.trim()
                                                        : event.venue || 'To be announced'
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Coordinator */}
                                    {event.coordinator && (
                                        <div>
                                            <div className="flex items-start mb-2">
                                                <User className={`w-5 h-5 mt-0.5 mr-3 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
                                                <div>
                                                    <div className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>Event Coordinator</div>
                                                    <div className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                                                        {event.coordinator.name || 'Not specified'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Contact */}
                                    {(event.coordinator?.phone || event.organizer?.phone) && (
                                        <div>
                                            <div className="flex items-start">
                                                <Phone className={`w-5 h-5 mt-0.5 mr-3 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
                                                <div>
                                                    <div className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>Contact</div>
                                                    <div className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                                                        {event.coordinator?.phone || event.organizer?.phone}
                                                    </div>
                                                    {event.coordinator?.email && (
                                                        <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                            {event.coordinator.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Mode */}
                                    {event.mode && (
                                        <div className={`px-3 py-2 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'}`}>
                                            <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                                📍 Mode: <span className="font-semibold">{event.mode}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Created Info */}
                                    <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} pt-4 border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                                        <div>Created: {formatDateTime(event.createdAt)}</div>
                                        <div>Last Updated: {formatDateTime(event.updatedAt)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Features Card */}
                        <div className={`rounded-2xl shadow-lg overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                            <div className="p-6">
                                <h3 className={`text-lg font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                    Event Features
                                </h3>
                                <div className="space-y-3">
                                    {event.certificateProvided && (
                                        <div className="flex items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${theme === 'light' ? 'bg-green-100 text-green-600' : 'bg-green-900 text-green-300'}`}>
                                                🏆
                                            </div>
                                            <div>
                                                <div className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Certificate</div>
                                                <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    {event.certificateType || 'Participation'} Certificate
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {event.isHandsOn && (
                                        <div className="flex items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-blue-900 text-blue-300'}`}>
                                                🔧
                                            </div>
                                            <div>
                                                <div className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Hands-on Workshop</div>
                                                <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Practical learning experience</div>
                                            </div>
                                        </div>
                                    )}

                                    {event.prizes && (
                                        <div className="flex items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${theme === 'light' ? 'bg-yellow-100 text-yellow-600' : 'bg-yellow-900 text-yellow-300'}`}>
                                                💰
                                            </div>
                                            <div>
                                                <div className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Prizes</div>
                                                <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    1st: ₹{event.prizes.firstPrize || '0'}, 2nd: ₹{event.prizes.secondPrize || '0'}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SportEventDetailsPage;
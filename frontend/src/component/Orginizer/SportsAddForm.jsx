

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../Context/TheamContext';
import axios from 'axios'
import { CreateEventSport } from '../../ApiInstance/Allapis';

const CreateSportsEvent = () => {

    const { theme } = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const [formData, setFormData] = useState({
        eventName: '',
        category: '',
        sportName: '',
        eventType: 'Solo',
        maxParticipants: 1,
        venue: '',
        eventDate: '',
        registrationDeadline: '',
        matchRules: '',
        coordinator: {
            name: '',
            phone: ''
        },
        isActive: true
    });

    const [errors, setErrors] = useState({});

    // Sport options based on category
    const sportOptions = {
        'Indoor Sports': ['Chess', 'Carrom', 'Table Tennis'],
        'Outdoor Sports': ['Cricket', 'Football', 'Volleyball', 'Kabaddi'],
        'E-Sports': ['BGMI', 'Valorant', 'FIFA']
    };

    // Event type max participants
    const maxParticipantsByEventType = {
        'Solo': { min: 1, max: 100 },
        'Team': { min: 2, max: 50 }
    };





    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleCategoryChange = (category) => {
        setFormData(prev => ({
            ...prev,
            category,
            sportName: '' // Reset sport when category changes
        }));
    };

    const handleEventTypeChange = (eventType) => {
        setFormData(prev => ({
            ...prev,
            eventType,
            maxParticipants: maxParticipantsByEventType[eventType].min
        }));
    };

    // Validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.eventName.trim()) newErrors.eventName = 'Event name is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.sportName) newErrors.sportName = 'Sport name is required';
        if (!formData.venue.trim()) newErrors.venue = 'Venue is required';
        if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
        if (!formData.registrationDeadline) newErrors.registrationDeadline = 'Registration deadline is required';

        // Validate dates
        if (formData.eventDate && formData.registrationDeadline) {
            const eventDate = new Date(formData.eventDate);
            const regDeadline = new Date(formData.registrationDeadline);

            if (regDeadline >= eventDate) {
                newErrors.registrationDeadline = 'Registration deadline must be before event date';
            }

            // Check if registration deadline is in the past
            const now = new Date();
            if (regDeadline < now) {
                newErrors.registrationDeadline = 'Registration deadline cannot be in the past';
            }
        }

        // Validate coordinator info
        if (!formData.coordinator.name.trim()) newErrors['coordinator.name'] = 'Coordinator name is required';
        if (!formData.coordinator.phone.trim()) newErrors['coordinator.phone'] = 'Coordinator phone is required';
        else if (!/^[0-9]{10}$/.test(formData.coordinator.phone.replace(/\D/g, ''))) {
            newErrors['coordinator.phone'] = 'Enter a valid 10-digit phone number';
        }

        // Validate max participants
        const { min, max } = maxParticipantsByEventType[formData.eventType];
        if (formData.maxParticipants < min || formData.maxParticipants > max) {
            newErrors.maxParticipants = `Must be between ${min} and ${max} for ${formData.eventType} events`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("✅ handleSubmit triggered");
        console.log("📦 Raw Form Data:", formData);

        if (!validateForm()) {
            console.log("❌ Validation failed");
            return;
        }

        setLoading(true);

        try {
            // 🔍 DEBUG DATE VALUES
            console.log("📅 eventDate raw:", formData.eventDate);
            console.log("📅 registrationDeadline raw:", formData.registrationDeadline);

            // 🚨 PREVENT CRASH
            if (!formData.eventDate || !formData.registrationDeadline) {
                throw new Error("Event Date or Registration Deadline missing");
            }

            const submitData = {
                eventName: formData.eventName,
                category: formData.category,
                sportName: formData.sportName,
                eventType: formData.eventType,
                maxParticipants: formData.maxParticipants,
                venue: formData.venue,

                eventDate: new Date(formData.eventDate).toISOString(),
                registrationDeadline: new Date(formData.registrationDeadline).toISOString(),

                matchRules: formData.matchRules || "",
                coordinator: {
                    name: formData.coordinator.name,
                    phone: formData.coordinator.phone,
                },
                isActive: true,
            };



            const response = await axios.post(
                CreateEventSport,
                submitData,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            console.log("✅ Axios Response:", response);

            const result = response.data;
            console.log("📥 API Result:", result);

            if (result?.success) {
                console.log("🎉 Event created successfully");

                setSubmitSuccess(true);

                setFormData({
                    eventName: "",
                    category: "",
                    sportName: "",
                    eventType: "Solo",
                    maxParticipants: 1,
                    venue: "",
                    eventDate: "",
                    registrationDeadline: "",
                    matchRules: "",
                    coordinator: { name: "", phone: "" },
                    isActive: true,
                });

                setTimeout(() => setSubmitSuccess(false), 3000);
            } else {
                console.error("❌ API returned failure:", result);
                alert(result?.message || "Failed to create event");
            }
        } catch (error) {
            console.error("🔥 ERROR CAUGHT:");
            console.error(error);

            if (error.response) {
                console.error("📥 Server Response:", error.response.data);
                console.error("📊 Status Code:", error.response.status);
            } else {
                console.error("⚠️ JS Runtime Error:", error.message);
            }

            alert(error.message || "Something went wrong");
        } finally {
            console.log("🔚 handleSubmit finished");
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen transition-all duration-300 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
            {/* Header */}
            <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} shadow-sm`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                                <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                    🏆 Create Sports Event
                                </h1>
                                <p className={`mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                    Fill out the form to announce a new sports event to students
                                </p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <button
                                    onClick={() => navigate('/events')}
                                    className={`px-4 py-2 rounded-lg font-medium ${theme === 'light'
                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    ← Back to Events
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {submitSuccess && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between animate-slideIn">
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">✅</span>
                            <div>
                                <p className="font-semibold">Event Created Successfully!</p>
                                <p className="text-sm opacity-90">The event has been announced to students.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSubmitSuccess(false)}
                            className="text-white hover:text-gray-200"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Main Form */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className={`rounded-2xl shadow-xl overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                    <form onSubmit={handleSubmit} className="p-8">
                        <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                            Event Information
                        </h2>

                        <div className="space-y-8">
                            {/* Event Name */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                    Event Name *
                                </label>
                                <input
                                    type="text"
                                    name="eventName"
                                    value={formData.eventName}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.eventName ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                        } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                    placeholder="e.g., Annual Cricket Tournament, Chess Championship, etc."
                                />
                                {errors.eventName && (
                                    <p className="mt-1 text-sm text-red-500">{errors.eventName}</p>
                                )}
                            </div>

                            {/* Category & Sport */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Category */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                        Category *
                                    </label>
                                    <div className="space-y-2">
                                        {['Indoor Sports', 'Outdoor Sports', 'E-Sports'].map((cat) => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => handleCategoryChange(cat)}
                                                className={`w-full px-4 py-3 rounded-lg border transition-all flex items-center space-x-3 ${formData.category === cat
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent'
                                                    : errors.category
                                                        ? 'border-red-500 hover:border-red-600'
                                                        : theme === 'light'
                                                            ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                                            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                                                    }`}
                                            >
                                                <span className="text-xl">
                                                    {cat === 'Indoor Sports' ? '🏓' :
                                                        cat === 'Outdoor Sports' ? '⚽' :
                                                            '🎮'}
                                                </span>
                                                <span>{cat}</span>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.category && (
                                        <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                                    )}
                                </div>

                                {/* Sport Name */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                        Sport Name *
                                    </label>
                                    <div className="space-y-2">
                                        {formData.category && sportOptions[formData.category]?.map((sport) => (
                                            <button
                                                key={sport}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, sportName: sport }))}
                                                className={`w-full px-4 py-3 rounded-lg border transition-all flex items-center space-x-3 ${formData.sportName === sport
                                                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white border-transparent'
                                                    : errors.sportName
                                                        ? 'border-red-500 hover:border-red-600'
                                                        : theme === 'light'
                                                            ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                                            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                                                    }`}
                                            >
                                                <span className="text-xl">
                                                    {sport === 'Chess' ? '♟️' :
                                                        sport === 'Carrom' ? '🔴' :
                                                            sport === 'Table Tennis' ? '🏓' :
                                                                sport === 'Cricket' ? '🏏' :
                                                                    sport === 'Football' ? '⚽' :
                                                                        sport === 'Volleyball' ? '🏐' :
                                                                            sport === 'Kabaddi' ? '🤼' :
                                                                                sport === 'BGMI' ? '📱' :
                                                                                    sport === 'Valorant' ? '🎯' :
                                                                                        '🎮'}
                                                </span>
                                                <span>{sport}</span>
                                            </button>
                                        ))}
                                        {!formData.category && (
                                            <div className={`text-center py-3 rounded-lg ${theme === 'light' ? 'bg-gray-100 text-gray-500' : 'bg-gray-700 text-gray-400'}`}>
                                                Select a category first
                                            </div>
                                        )}
                                    </div>
                                    {errors.sportName && (
                                        <p className="mt-1 text-sm text-red-500">{errors.sportName}</p>
                                    )}
                                </div>
                            </div>

                            {/* Event Type & Max Participants */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Event Type */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                        Event Type *
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Solo', 'Team'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => handleEventTypeChange(type)}
                                                className={`px-4 py-3 rounded-lg border transition-all flex items-center justify-center space-x-2 ${formData.eventType === type
                                                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white border-transparent'
                                                    : theme === 'light'
                                                        ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                                        : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                                                    }`}
                                            >
                                                <span>{type === 'Solo' ? '👤' : '👥'}</span>
                                                <span>{type}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Max Participants */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                        Max Participants *
                                    </label>
                                    <input
                                        type="number"
                                        name="maxParticipants"
                                        value={formData.maxParticipants}
                                        onChange={handleInputChange}
                                        min={maxParticipantsByEventType[formData.eventType].min}
                                        max={maxParticipantsByEventType[formData.eventType].max}
                                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.maxParticipants ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                            } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                    />
                                    {errors.maxParticipants ? (
                                        <p className="mt-1 text-sm text-red-500">{errors.maxParticipants}</p>
                                    ) : (
                                        <p className="mt-1 text-sm text-gray-500">
                                            {formData.eventType === 'Solo'
                                                ? 'Maximum individual participants'
                                                : 'Maximum number of teams'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Venue & Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Venue */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                        Venue *
                                    </label>
                                    <input
                                        type="text"
                                        name="venue"
                                        value={formData.venue}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.venue ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                            } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                        placeholder="e.g., Main Stadium, Sports Complex, etc."
                                    />
                                    {errors.venue && (
                                        <p className="mt-1 text-sm text-red-500">{errors.venue}</p>
                                    )}
                                </div>

                                {/* Event Date */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                        Event Date & Time *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="eventDate"
                                        value={formData.eventDate}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.eventDate ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                            } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                    />
                                    {errors.eventDate && (
                                        <p className="mt-1 text-sm text-red-500">{errors.eventDate}</p>
                                    )}
                                </div>
                            </div>

                            {/* Registration Deadline & Coordinator */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Registration Deadline */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                        Registration Deadline *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="registrationDeadline"
                                        value={formData.registrationDeadline}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.registrationDeadline ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                            } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                    />
                                    {errors.registrationDeadline && (
                                        <p className="mt-1 text-sm text-red-500">{errors.registrationDeadline}</p>
                                    )}
                                    <p className="mt-1 text-sm text-gray-500">
                                        Students can register until this date
                                    </p>
                                </div>

                                {/* Coordinator Name */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                        Coordinator Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="coordinator.name"
                                        value={formData.coordinator.name}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors['coordinator.name'] ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                            } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                        placeholder="Coordinator's full name"
                                    />
                                    {errors['coordinator.name'] && (
                                        <p className="mt-1 text-sm text-red-500">{errors['coordinator.name']}</p>
                                    )}
                                </div>
                            </div>

                            {/* Coordinator Phone */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                    Coordinator Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="coordinator.phone"
                                    value={formData.coordinator.phone}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors['coordinator.phone'] ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                        } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                    placeholder="Enter 10-digit phone number"
                                />
                                {errors['coordinator.phone'] && (
                                    <p className="mt-1 text-sm text-red-500">{errors['coordinator.phone']}</p>
                                )}
                                <p className="mt-1 text-sm text-gray-500">
                                    This will be displayed to students for queries
                                </p>
                            </div>

                            {/* Match Rules */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                    Match Rules & Guidelines (Optional)
                                </label>
                                <textarea
                                    name="matchRules"
                                    value={formData.matchRules}
                                    onChange={handleInputChange}
                                    rows="5"
                                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                        } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                    placeholder="Enter match format, rules, scoring system, eligibility criteria, etc."
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    This information will help students understand the event better
                                </p>
                            </div>
                        </div>



                        {/* Submit Button */}
                        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <button
                                    type="button"
                                    onClick={() => navigate('/events')}
                                    className={`px-6 py-3 rounded-lg font-medium ${theme === 'light'
                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Creating Event...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>🏆</span>
                                            <span>Create & Announce Event</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Event Preview */}
                <div className={`mt-8 rounded-2xl shadow-xl overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                    <div className="p-6">
                        <h3 className={`text-xl font-bold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                            📋 Event Preview
                        </h3>
                        <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'}`}>
                            {formData.eventName ? (
                                <div className="space-y-3">
                                    <div>
                                        <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                            Event:
                                        </span>
                                        <p className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                                            {formData.eventName}
                                        </p>
                                    </div>
                                    {formData.category && formData.sportName && (
                                        <div>
                                            <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                                Sport:
                                            </span>
                                            <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
                                                {formData.sportName} ({formData.category})
                                            </p>
                                        </div>
                                    )}
                                    {formData.venue && (
                                        <div>
                                            <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                                Venue:
                                            </span>
                                            <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
                                                {formData.venue}
                                            </p>
                                        </div>
                                    )}
                                    {formData.eventDate && (
                                        <div>
                                            <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                                Date:
                                            </span>
                                            <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
                                                {new Date(formData.eventDate).toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                    {formData.coordinator.name && (
                                        <div>
                                            <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                                Contact:
                                            </span>
                                            <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}>
                                                {formData.coordinator.name} - {formData.coordinator.phone}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className={`text-center py-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Fill the form to see a preview of your event announcement
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add custom styles */}
            <style jsx global>{`
                @keyframes slideIn {
                    from {
                        transform: translateY(-10px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default CreateSportsEvent;
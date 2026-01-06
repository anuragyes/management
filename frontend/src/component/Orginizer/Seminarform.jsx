import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../Context/TheamContext';
import axios from 'axios';
import { CreateEventSeminar } from '../../ApiInstance/Allapis';

const CreateSeminar = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const [formData, setFormData] = useState({
        // 1. Basic Seminar Info
        title: '',
        seminarType: '',
        description: '',
        topic: '',
        mode: '',

        // 2. Date & Time
        date: '',
        timing: '',
        duration: '',

        // 3. Venue / Platform
        venue: {
            collegeName: '',
            hallName: '',
            roomNumber: ''
        },
        onlinePlatform: '',

        // 4. Speaker Details
        speaker: {
            name: '',
            designation: '',
            organization: '',
            experience: '',
            alumniBatch: '',
            linkedinProfile: ''
        },

        // 5. Audience / Eligibility
        eligibleBranches: ['All'],
        eligibleYears: [],

        // 6. Registration Details
        registrationRequired: true,
        registrationStartDate: '',
        registrationEndDate: '',
        registrationFee: 'Free',
        feeAmount: 0,
        totalSeats: '',
    });

    const [errors, setErrors] = useState({});
    const [currentYear, setCurrentYear] = useState('');

    // Seminar type options
    const seminarTypes = ["Industry Expert", "Startup Founder", "Alumni Talk"];

    // Mode options
    const modes = ["Offline", "Online", "Hybrid"];

    // Year options
    const yearOptions = ["1st", "2nd", "3rd", "4th", "5th"];

    // Certificate types
    const certificateTypes = ["Participation", "Attendance"];

    // Common branches
    const branchOptions = [
        "All", "CSE", "IT", "ECE", "EEE", "Mechanical", "Civil",
        "Chemical", "Biotech", "MBA", "MCA", "BBA", "BCA", "Other"
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleArrayChange = (field, value, index) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({
            ...prev,
            [field]: newArray
        }));
    };

    const handleAddKeyTakeaway = () => {
        setFormData(prev => ({
            ...prev,
            keyTakeaways: [...prev.keyTakeaways, '']
        }));
    };

    const handleRemoveKeyTakeaway = (index) => {
        if (formData.keyTakeaways.length > 1) {
            const newTakeaways = formData.keyTakeaways.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                keyTakeaways: newTakeaways
            }));
        }
    };

    const handleYearToggle = (year) => {
        const currentYears = [...formData.eligibleYears];
        const index = currentYears.indexOf(year);

        if (index > -1) {
            currentYears.splice(index, 1);
        } else {
            currentYears.push(year);
        }

        setFormData(prev => ({
            ...prev,
            eligibleYears: currentYears
        }));
    };

    const handleBranchToggle = (branch) => {
        const currentBranches = [...formData.eligibleBranches];

        if (branch === 'All') {
            // If 'All' is selected, clear other selections
            setFormData(prev => ({
                ...prev,
                eligibleBranches: ['All']
            }));
            return;
        }

        const index = currentBranches.indexOf(branch);

        if (index > -1) {
            currentBranches.splice(index, 1);
            // If removing 'All', keep it removed
            const allIndex = currentBranches.indexOf('All');
            if (allIndex > -1) {
                currentBranches.splice(allIndex, 1);
            }
        } else {
            currentBranches.push(branch);
            // If any specific branch is selected, remove 'All'
            const allIndex = currentBranches.indexOf('All');
            if (allIndex > -1) {
                currentBranches.splice(allIndex, 1);
            }
        }

        setFormData(prev => ({
            ...prev,
            eligibleBranches: currentBranches
        }));
    };

    // Validation
    const validateForm = () => {
        const newErrors = {};

        // Basic Info
        if (!formData.title.trim()) newErrors.title = 'Seminar title is required';
        if (!formData.seminarType) newErrors.seminarType = 'Seminar type is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.topic.trim()) newErrors.topic = 'Topic is required';
        if (!formData.mode) newErrors.mode = 'Mode is required';

        // Date & Time
        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.timing.trim()) newErrors.timing = 'Timing is required';

        // Venue based on mode
        if (formData.mode === 'Offline' || formData.mode === 'Hybrid') {
            if (!formData.venue.collegeName.trim()) newErrors['venue.collegeName'] = 'College name is required';
        }
        if (formData.mode === 'Online' || formData.mode === 'Hybrid') {
            if (!formData.onlinePlatform.trim()) newErrors.onlinePlatform = 'Online platform is required';
        }

        // Speaker Details
        if (!formData.speaker.name.trim()) newErrors['speaker.name'] = 'Speaker name is required';
        if (formData.seminarType === 'Alumni Talk' && !formData.speaker.alumniBatch.trim()) {
            newErrors['speaker.alumniBatch'] = 'Alumni batch is required for alumni talks';
        }

        // Registration dates validation
        if (formData.registrationRequired) {
            if (formData.registrationStartDate && formData.registrationEndDate) {
                const startDate = new Date(formData.registrationStartDate);
                const endDate = new Date(formData.registrationEndDate);
                const seminarDate = new Date(formData.date);

                if (endDate >= seminarDate) {
                    newErrors.registrationEndDate = 'Registration must end before seminar date';
                }
                if (startDate >= endDate) {
                    newErrors.registrationStartDate = 'Registration start date must be before end date';
                }
            }
        }



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("🟢 SUBMIT CLICKED");
        console.log("FormData before validation:", formData);

        /* ---------- STEP 1: VALIDATION ---------- */
        const isValid = validateForm();
        console.log("Validation result:", isValid);

        if (!isValid) {
            console.warn("❌ Validation failed. API will NOT be called.");
            return;
        }

        console.log("✅ Validation passed");

        setLoading(true);
        console.log("⏳ Loading set to TRUE");

        try {
            /* ---------- STEP 2: PREPARE PAYLOAD ---------- */
            const submitData = {
                title: formData.title,
                seminarType: formData.seminarType,
                description: formData.description,
                topic: formData.topic,
                mode: formData.mode,
                date: new Date(formData.date).toISOString(),
                timing: formData.timing,
                duration: formData.duration || undefined,
                venue: formData.venue,
                onlinePlatform: formData.onlinePlatform || undefined,

                speaker: {
                    name: formData.speaker.name|| "Unknown",
                    designation: formData.speaker.designation || undefined,
                    organization: formData.speaker.organization || undefined,
                    experience: formData.speaker.experience
                        ? parseInt(formData.speaker.experience)
                        : undefined,
                    alumniBatch: formData.speaker.alumniBatch || undefined,
                    linkedinProfile: formData.speaker.linkedinProfile || undefined,
                },

                eligibleBranches: formData.eligibleBranches,
                eligibleYears: formData.eligibleYears,
                registrationRequired: formData.registrationRequired,
                registrationStartDate: formData.registrationStartDate
                    ? new Date(formData.registrationStartDate).toISOString()
                    : undefined,
                registrationEndDate: formData.registrationEndDate
                    ? new Date(formData.registrationEndDate).toISOString()
                    : undefined,
                registrationFee: formData.registrationFee,
                feeAmount: formData.feeAmount,
                totalSeats: formData.totalSeats
                    ? parseInt(formData.totalSeats)
                    : undefined,
                certificateProvided: formData.certificateProvided,
                certificateType: formData.certificateType || undefined,

               

                status: "Draft",
            };

            // console.log("📦 Payload prepared:", submitData);
            // console.log(
            //     " API URL:",
            //     "http://localhost:5000/api/event/seminar/createseminar"
            // );

            /* ---------- STEP 3: API CALL ---------- */
            const response = await axios.post(
                CreateEventSeminar,
                submitData,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            console.log("✅ API RESPONSE RECEIVED");
            console.log("Response status:", response.status);
            console.log("Response data:", response.data);

            /* ---------- STEP 4: HANDLE RESPONSE ---------- */
            if (response.data.success) {
                console.log("🎉 Seminar created successfully");

                setSubmitSuccess(true);

                setFormData({
                    title: "",
                    seminarType: "",
                    description: "",
                    topic: "",
                    mode: "",
                    date: "",
                    timing: "",
                    duration: "",
                    venue: { collegeName: "", hallName: "", roomNumber: "" },
                    onlinePlatform: "",
                    speaker: {
                        name: "",
                        designation: "",
                        organization: "",
                        experience: "",
                        alumniBatch: "",
                        linkedinProfile: "",
                    },
                    eligibleBranches: ["All"],
                    eligibleYears: [],
                    registrationRequired: true,
                    registrationStartDate: "",
                    registrationEndDate: "",
                    registrationFee: "Free",
                    feeAmount: 0,
                    totalSeats: "",
                    certificateProvided: false,
                    certificateType: "",
                    organizer: { name: "", department: "", phone: "", email: "" },
                    status: "Draft",
                });

                setTimeout(() => setSubmitSuccess(false), 3000);
            } else {
                console.warn("⚠️ API returned failure:", response.data.message);
                alert(response.data.message || "Failed to create seminar");
            }
        } catch (error) {
            console.error("🔥 API ERROR OCCURRED");

            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Data:", error.response.data);
                alert(error.response.data.message || "Server error");
            } else {
                console.error("Error message:", error.message);
                alert("Network error or server not reachable");
            }
        } finally {
            setLoading(false);
            console.log("⏹ Loading set to FALSE");
        }
    };

    return (
        <div className={`min-h-screen transition-all duration-300 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
            {/* Header */}
            <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} shadow-sm`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                                <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                    🎤 Create Seminar
                                </h1>
                                <p className={`mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                    Fill out the form to organize a new seminar
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
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between animate-slideIn">
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">✅</span>
                            <div>
                                <p className="font-semibold">Seminar Created Successfully!</p>
                                <p className="text-sm opacity-90">The seminar has been saved as draft.</p>
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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className={`rounded-2xl shadow-xl overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="space-y-10">
                            {/* Section 1: Basic Seminar Info */}
                            <div>
                                <h2 className={`text-xl font-bold mb-6 pb-3 border-b ${theme === 'light' ? 'text-gray-800 border-gray-200' : 'text-white border-gray-700'}`}>
                                    1. Basic Seminar Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Title */}
                                    <div className="md:col-span-2">
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Seminar Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.title ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                            placeholder="e.g., Future of AI in Industry"
                                        />
                                        {errors.title && (
                                            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                                        )}
                                    </div>

                                    {/* Seminar Type */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Seminar Type *
                                        </label>
                                        <div className="space-y-2">
                                            {seminarTypes.map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, seminarType: type }))}
                                                    className={`w-full px-4 py-3 rounded-lg border transition-all flex items-center space-x-3 ${formData.seminarType === type
                                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent'
                                                            : errors.seminarType
                                                                ? 'border-red-500 hover:border-red-600'
                                                                : theme === 'light'
                                                                    ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                                                    : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                                                        }`}
                                                >
                                                    <span className="text-xl">
                                                        {type === 'Industry Expert' ? '👨‍💼' :
                                                            type === 'Startup Founder' ? '🚀' :
                                                                '🎓'}
                                                    </span>
                                                    <span>{type}</span>
                                                </button>
                                            ))}
                                        </div>
                                        {errors.seminarType && (
                                            <p className="mt-1 text-sm text-red-500">{errors.seminarType}</p>
                                        )}
                                    </div>

                                    {/* Mode */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Mode *
                                        </label>
                                        <div className="space-y-2">
                                            {modes.map((mode) => (
                                                <button
                                                    key={mode}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, mode: mode }))}
                                                    className={`w-full px-4 py-3 rounded-lg border transition-all flex items-center space-x-3 ${formData.mode === mode
                                                            ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white border-transparent'
                                                            : errors.mode
                                                                ? 'border-red-500 hover:border-red-600'
                                                                : theme === 'light'
                                                                    ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                                                    : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                                                        }`}
                                                >
                                                    <span className="text-xl">
                                                        {mode === 'Offline' ? '🏛️' :
                                                            mode === 'Online' ? '💻' :
                                                                '🌐'}
                                                    </span>
                                                    <span>{mode}</span>
                                                </button>
                                            ))}
                                        </div>
                                        {errors.mode && (
                                            <p className="mt-1 text-sm text-red-500">{errors.mode}</p>
                                        )}
                                    </div>

                                    {/* Topic */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Topic *
                                        </label>
                                        <input
                                            type="text"
                                            name="topic"
                                            value={formData.topic}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.topic ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                            placeholder="e.g., Artificial Intelligence, Blockchain, etc."
                                        />
                                        {errors.topic && (
                                            <p className="mt-1 text-sm text-red-500">{errors.topic}</p>
                                        )}
                                    </div>

                                    {/* Duration */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Duration
                                        </label>
                                        <input
                                            type="text"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                            placeholder="e.g., 2 Hours, 90 Minutes"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="md:col-span-2">
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Description *
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="4"
                                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.description ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                            placeholder="Detailed description about the seminar..."
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Date & Time */}
                            <div>
                                <h2 className={`text-xl font-bold mb-6 pb-3 border-b ${theme === 'light' ? 'text-gray-800 border-gray-200' : 'text-white border-gray-700'}`}>
                                    2. Date & Time
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Date */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.date ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                        />
                                        {errors.date && (
                                            <p className="mt-1 text-sm text-red-500">{errors.date}</p>
                                        )}
                                    </div>

                                    {/* Timing */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Timing *
                                        </label>
                                        <input
                                            type="text"
                                            name="timing"
                                            value={formData.timing}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.timing ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                            placeholder="e.g., 11:00 AM - 1:00 PM"
                                        />
                                        {errors.timing && (
                                            <p className="mt-1 text-sm text-red-500">{errors.timing}</p>
                                        )}
                                    </div>

                                    {/* Duration */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Duration (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                            placeholder="e.g., 2 Hours"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Venue / Platform */}
                            <div>
                                <h2 className={`text-xl font-bold mb-6 pb-3 border-b ${theme === 'light' ? 'text-gray-800 border-gray-200' : 'text-white border-gray-700'}`}>
                                    3. Venue & Platform Details
                                </h2>

                                {(formData.mode === 'Offline' || formData.mode === 'Hybrid') && (
                                    <div className="mb-6">
                                        <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            📍 Offline Venue
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                                    College Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="venue.collegeName"
                                                    value={formData.venue.collegeName}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors['venue.collegeName'] ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                        } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                                    placeholder="College name"
                                                />
                                                {errors['venue.collegeName'] && (
                                                    <p className="mt-1 text-sm text-red-500">{errors['venue.collegeName']}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                                    Hall Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="venue.hallName"
                                                    value={formData.venue.hallName}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                        } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                                    placeholder="e.g., Seminar Hall, Auditorium"
                                                />
                                            </div>
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                                    Room Number
                                                </label>
                                                <input
                                                    type="text"
                                                    name="venue.roomNumber"
                                                    value={formData.venue.roomNumber}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                        } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                                    placeholder="e.g., Room 101"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {(formData.mode === 'Online' || formData.mode === 'Hybrid') && (
                                    <div>
                                        <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            💻 Online Platform
                                        </h3>
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                                Platform Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="onlinePlatform"
                                                value={formData.onlinePlatform}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.onlinePlatform ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                    } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                                placeholder="e.g., Zoom, Google Meet, Microsoft Teams"
                                            />
                                            {errors.onlinePlatform && (
                                                <p className="mt-1 text-sm text-red-500">{errors.onlinePlatform}</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section 4: Speaker Details */}
                            <div>
                                <h2 className={`text-xl font-bold mb-6 pb-3 border-b ${theme === 'light' ? 'text-gray-800 border-gray-200' : 'text-white border-gray-700'}`}>
                                    4. Speaker Details
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Speaker Name */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Speaker Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="speaker.name"
                                            value={formData.speaker.name}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors['speaker.name'] ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                            placeholder="Full name of speaker"
                                        />
                                        {errors['speaker.name'] && (
                                            <p className="mt-1 text-sm text-red-500">{errors['speaker.name']}</p>
                                        )}
                                    </div>

                                    {/* Designation */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Designation
                                        </label>
                                        <input
                                            type="text"
                                            name="speaker.designation"
                                            value={formData.speaker.designation}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                            placeholder="e.g., Senior Developer, CEO, Professor"
                                        />
                                    </div>

                                    {/* Organization */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Organization
                                        </label>
                                        <input
                                            type="text"
                                            name="speaker.organization"
                                            value={formData.speaker.organization}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                            placeholder="Company/Startup/University"
                                        />
                                    </div>

                                    {/* Experience */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Experience (Years)
                                        </label>
                                        <input
                                            type="number"
                                            name="speaker.experience"
                                            value={formData.speaker.experience}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                            placeholder="Years of experience"
                                            min="0"
                                        />
                                    </div>

                                    {/* Alumni Batch (only for Alumni Talk) */}
                                    {formData.seminarType === 'Alumni Talk' && (
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                                Alumni Batch *
                                            </label>
                                            <input
                                                type="text"
                                                name="speaker.alumniBatch"
                                                value={formData.speaker.alumniBatch}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors['speaker.alumniBatch'] ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                    } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                                placeholder="e.g., 2015-2019"
                                            />
                                            {errors['speaker.alumniBatch'] && (
                                                <p className="mt-1 text-sm text-red-500">{errors['speaker.alumniBatch']}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* LinkedIn Profile */}
                                    <div className="md:col-span-2">
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            LinkedIn Profile
                                        </label>
                                        <input
                                            type="url"
                                            name="speaker.linkedinProfile"
                                            value={formData.speaker.linkedinProfile}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                            placeholder="https://linkedin.com/in/username"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 5: Audience & Eligibility */}
                            <div>
                                <h2 className={`text-xl font-bold mb-6 pb-3 border-b ${theme === 'light' ? 'text-gray-800 border-gray-200' : 'text-white border-gray-700'}`}>
                                    5. Audience & Eligibility
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Eligible Branches */}
                                    <div>
                                        <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Eligible Branches
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {branchOptions.map((branch) => (
                                                <button
                                                    key={branch}
                                                    type="button"
                                                    onClick={() => handleBranchToggle(branch)}
                                                    className={`px-3 py-2 rounded-lg border transition-all text-sm ${formData.eligibleBranches.includes(branch)
                                                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                                                            : theme === 'light'
                                                                ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                                : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                                        }`}
                                                >
                                                    {branch}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Eligible Years */}
                                    <div>
                                        <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Eligible Years
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {yearOptions.map((year) => (
                                                <button
                                                    key={year}
                                                    type="button"
                                                    onClick={() => handleYearToggle(year)}
                                                    className={`px-3 py-2 rounded-lg border transition-all text-sm ${formData.eligibleYears.includes(year)
                                                            ? 'bg-green-100 text-green-700 border-green-300'
                                                            : theme === 'light'
                                                                ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                                : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                                        }`}
                                                >
                                                    {year} Year
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 6: Registration Details */}
                            <div>
                                <h2 className={`text-xl font-bold mb-6 pb-3 border-b ${theme === 'light' ? 'text-gray-800 border-gray-200' : 'text-white border-gray-700'}`}>
                                    6. Registration Details
                                </h2>

                                <div className="space-y-6">
                                    {/* Registration Required */}
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            id="registrationRequired"
                                            name="registrationRequired"
                                            checked={formData.registrationRequired}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 rounded"
                                        />
                                        <label htmlFor="registrationRequired" className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Registration Required
                                        </label>
                                    </div>

                                    {formData.registrationRequired && (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Registration Start Date */}
                                                <div>
                                                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                                        Registration Start Date
                                                    </label>
                                                    <input
                                                        type="datetime-local"
                                                        name="registrationStartDate"
                                                        value={formData.registrationStartDate}
                                                        onChange={handleInputChange}
                                                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.registrationStartDate ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                            } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                                    />
                                                    {errors.registrationStartDate && (
                                                        <p className="mt-1 text-sm text-red-500">{errors.registrationStartDate}</p>
                                                    )}
                                                </div>

                                                {/* Registration End Date */}
                                                <div>
                                                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                                        Registration End Date *
                                                    </label>
                                                    <input
                                                        type="datetime-local"
                                                        name="registrationEndDate"
                                                        value={formData.registrationEndDate}
                                                        onChange={handleInputChange}
                                                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.registrationEndDate ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                            } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                                    />
                                                    {errors.registrationEndDate && (
                                                        <p className="mt-1 text-sm text-red-500">{errors.registrationEndDate}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {/* Registration Fee Type */}
                                                <div>
                                                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                                        Registration Fee
                                                    </label>
                                                    <div className="space-y-2">
                                                        {['Free', 'Paid'].map((feeType) => (
                                                            <button
                                                                key={feeType}
                                                                type="button"
                                                                onClick={() => setFormData(prev => ({ ...prev, registrationFee: feeType }))}
                                                                className={`w-full px-4 py-2 rounded-lg border transition-all ${formData.registrationFee === feeType
                                                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent'
                                                                        : theme === 'light'
                                                                            ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                                                            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                                                                    }`}
                                                            >
                                                                {feeType}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Fee Amount (if Paid) */}
                                                {formData.registrationFee === 'Paid' && (
                                                    <div>
                                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                                            Fee Amount (₹)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="feeAmount"
                                                            value={formData.feeAmount}
                                                            onChange={handleInputChange}
                                                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                                            placeholder="Amount in rupees"
                                                            min="0"
                                                        />
                                                    </div>
                                                )}

                                                {/* Total Seats */}
                                                <div>
                                                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                                        Total Seats
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="totalSeats"
                                                        value={formData.totalSeats}
                                                        onChange={handleInputChange}
                                                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                            } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                                        placeholder="Number of seats"
                                                        min="1"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>




                        </div>

                        {/* Submit Button */}
                        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
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

                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, status: 'Draft' }))}
                                        className={`px-6 py-3 rounded-lg font-medium ${theme === 'light'
                                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        Save as Draft
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                <span>Creating Seminar...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>🎤</span>
                                                <span>Create Seminar</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
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

export default CreateSeminar;
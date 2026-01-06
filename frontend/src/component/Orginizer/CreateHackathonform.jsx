import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../Context/TheamContext';
import axios from 'axios';
import { CreateEventHackathon } from '../../ApiInstance/Allapis';

const CreateHackathon = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const [formData, setFormData] = useState({
        // 1. Basic Hackathon Info
        title: '',
        hackathonType: '',
        description: '',
        theme: '',
        mode: '',

        // 2. Date & Time
        startDate: '',
        endDate: '',
        duration: '',

        // 3. Venue / Platform
        venue: {
            collegeName: '',
            hallName: '',
            roomNumber: ''
        },
        onlinePlatform: '',

        // 4. Team Rules
        teamSize: {
            min: 1,
            max: 4
        },
        allowedBranches: ['All'],
        allowedYears: [],

        // 5. Registration Details
        registrationStartDate: '',
        registrationEndDate: '',
        registrationFee: 'Free',
        feeAmount: 0,
        totalTeams: '',

        // 6. Evaluation & Rules
        judgingCriteria: [''],
        rules: [''],
        problemStatements: [''],

        // 7. Rewards
        prizes: {
            firstPrize: '',
            secondPrize: '',
            thirdPrize: ''
        },
        certificateProvided: true,

        // 8. Organizer Info
        organizer: {
            name: '',
            department: '',
            phone: '',
            email: ''
        },

        // 9. Status
        status: 'Draft'
    });

    const [errors, setErrors] = useState({});

    // Hackathon type options
    const hackathonTypes = [
        "24-Hour Hackathon",
        "48-Hour Hackathon",
        "Problem Solving Challenge"
    ];

    // Mode options
    const modes = ["Offline", "Online", "Hybrid"];

    // Year options
    const yearOptions = ["1st", "2nd", "3rd", "4th", "5th"];

    // Common branches
    const branchOptions = [
        "All", "CSE", "IT", "ECE", "EEE", "Mechanical", "Civil",
        "Chemical", "Biotech", "MBA", "MCA", "BBA", "BCA", "Other"
    ];

    // Theme suggestions
    const themeSuggestions = [
        "AI & Machine Learning",
        "Blockchain & Web3",
        "FinTech",
        "HealthTech",
        "EdTech",
        "IoT & Smart Cities",
        "Cybersecurity",
        "Climate Tech",
        "E-Commerce",
        "Gaming & AR/VR",
        "Open Innovation"
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const keys = name.split('.');
            if (keys.length === 2) {
                const [parent, child] = keys;
                setFormData(prev => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: type === 'checkbox' ? checked : value
                    }
                }));
            } else if (keys.length === 3) {
                const [parent, child, subChild] = keys;
                setFormData(prev => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: {
                            ...prev[parent][child],
                            [subChild]: type === 'checkbox' ? checked : value
                        }
                    }
                }));
            }
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

    const handleAddArrayItem = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const handleRemoveArrayItem = (field, index) => {
        if (formData[field].length > 1) {
            const newArray = formData[field].filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                [field]: newArray
            }));
        }
    };

    const handleYearToggle = (year) => {
        const currentYears = [...formData.allowedYears];
        const index = currentYears.indexOf(year);

        if (index > -1) {
            currentYears.splice(index, 1);
        } else {
            currentYears.push(year);
        }

        setFormData(prev => ({
            ...prev,
            allowedYears: currentYears
        }));
    };

    const handleBranchToggle = (branch) => {
        const currentBranches = [...formData.allowedBranches];

        if (branch === 'All') {
            // If 'All' is selected, clear other selections
            setFormData(prev => ({
                ...prev,
                allowedBranches: ['All']
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
            allowedBranches: currentBranches
        }));
    };

    // Validation
    const validateForm = () => {
        const newErrors = {};

        // Basic Info
        if (!formData.title.trim()) newErrors.title = 'Hackathon title is required';
        if (!formData.hackathonType) newErrors.hackathonType = 'Hackathon type is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.mode) newErrors.mode = 'Mode is required';

        // Date & Time
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (!formData.duration.trim()) newErrors.duration = 'Duration is required';

        // Validate dates
        if (formData.startDate && formData.endDate) {
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);

            if (endDate <= startDate) {
                newErrors.endDate = 'End date must be after start date';
            }
        }

        // Venue based on mode
        if (formData.mode === 'Offline' || formData.mode === 'Hybrid') {
            if (!formData.venue.collegeName.trim()) newErrors['venue.collegeName'] = 'College name is required';
        }
        if (formData.mode === 'Online' || formData.mode === 'Hybrid') {
            if (!formData.onlinePlatform.trim()) newErrors.onlinePlatform = 'Online platform is required';
        }

        // Team size validation
        if (formData.teamSize.min > formData.teamSize.max) {
            newErrors.teamSize = 'Min team size cannot be greater than max';
        }

        // Registration dates validation
        if (formData.registrationStartDate && formData.registrationEndDate) {
            const regStart = new Date(formData.registrationStartDate);
            const regEnd = new Date(formData.registrationEndDate);
            const hackStart = new Date(formData.startDate);

            if (regEnd >= hackStart) {
                newErrors.registrationEndDate = 'Registration must end before hackathon starts';
            }
            if (regStart >= regEnd) {
                newErrors.registrationStartDate = 'Registration start date must be before end date';
            }
        }

        // Organizer Details
        if (!formData.organizer.name.trim()) newErrors['organizer.name'] = 'Organizer name is required';
        if (!formData.organizer.email.trim()) newErrors['organizer.email'] = 'Organizer email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.organizer.email)) {
            newErrors['organizer.email'] = 'Invalid email format';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("🟢 SUBMIT CLICKED - Hackathon");
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
                hackathonType: formData.hackathonType,
                description: formData.description,
                theme: formData.theme || undefined,
                mode: formData.mode,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                duration: formData.duration,
                venue: formData.venue,
                onlinePlatform: formData.onlinePlatform || undefined,
                teamSize: {
                    min: parseInt(formData.teamSize.min),
                    max: parseInt(formData.teamSize.max)
                },
                allowedBranches: formData.allowedBranches,
                allowedYears: formData.allowedYears,
                registrationStartDate: formData.registrationStartDate
                    ? new Date(formData.registrationStartDate).toISOString()
                    : undefined,
                registrationEndDate: formData.registrationEndDate
                    ? new Date(formData.registrationEndDate).toISOString()
                    : undefined,
                registrationFee: formData.registrationFee,
                feeAmount: formData.feeAmount,
                totalTeams: formData.totalTeams ? parseInt(formData.totalTeams) : undefined,
                judgingCriteria: formData.judgingCriteria.filter(c => c.trim() !== ''),
                rules: formData.rules.filter(r => r.trim() !== ''),
                problemStatements: formData.problemStatements.filter(p => p.trim() !== ''),
                prizes: {
                    firstPrize: formData.prizes.firstPrize || undefined,
                    secondPrize: formData.prizes.secondPrize || undefined,
                    thirdPrize: formData.prizes.thirdPrize || undefined
                },
                certificateProvided: formData.certificateProvided,
                organizer: {
                    name: formData.organizer.name,
                    department: formData.organizer.department || undefined,
                    phone: formData.organizer.phone || undefined,
                    email: formData.organizer.email
                },
                status: "Draft"
            };

            // console.log("📦 Payload prepared:", JSON.stringify(submitData, null, 2));
            // console.log("🌐 API URL:", "http://localhost:5000/api/hackathon/createhackathon");

            /* ---------- STEP 3: API CALL ---------- */
            const response = await axios.post(
                CreateEventHackathon,
                submitData,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            // console.log("✅ API RESPONSE RECEIVED");
            // console.log("Response status:", response.status);
            // console.log("Response data:", response.data);

            /* ---------- STEP 4: HANDLE RESPONSE ---------- */
            if (response.data.success) {
                console.log("🎉 Hackathon created successfully");

                setSubmitSuccess(true);

                // Reset form
                setFormData({
                    title: '',
                    hackathonType: '',
                    description: '',
                    theme: '',
                    mode: '',
                    startDate: '',
                    endDate: '',
                    duration: '',
                    venue: { collegeName: '', hallName: '', roomNumber: '' },
                    onlinePlatform: '',
                    teamSize: { min: 1, max: 4 },
                    allowedBranches: ['All'],
                    allowedYears: [],
                    registrationStartDate: '',
                    registrationEndDate: '',
                    registrationFee: 'Free',
                    feeAmount: 0,
                    totalTeams: '',
                    judgingCriteria: [''],
                    rules: [''],
                    problemStatements: [''],
                    prizes: { firstPrize: '', secondPrize: '', thirdPrize: '' },
                    certificateProvided: true,
                    organizer: { name: '', department: '', phone: '', email: '' },
                    status: 'Draft'
                });

                setTimeout(() => setSubmitSuccess(false), 3000);
            } else {
                console.warn("⚠️ API returned failure:", response.data.message);
                alert(response.data.message || "Failed to create hackathon");
            }
        } catch (error) {
            console.error("🔥 API ERROR OCCURRED");

            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Data:", error.response.data);
                alert(error.response.data.message || "Server error");
            } else if (error.request) {
                console.error("Request made but no response received:", error.request);
                alert("No response from server. Check if server is running.");
            } else {
                console.error("Error setting up request:", error.message);
                alert("Network error or server not reachable");
            }
        } finally {
            setLoading(false);
            console.log("⏹ Loading set to FALSE");
        }
    };

    // // Array Input Component
    // const ArrayInputSection = ({ title, field, placeholder }) => (
    //     <div className="space-y-3">
    //         <div className="flex justify-between items-center">
    //             <h4 className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
    //                 {title}
    //             </h4>
    //             <button
    //                 type="button"
    //                 onClick={() => handleAddArrayItem(field)}
    //                 className="text-blue-600 hover:text-blue-800 text-sm font-medium"
    //             >
    //                 + Add More
    //             </button>
    //         </div>
    //         {formData[field].map((item, index) => (
    //             <div key={index} className="flex items-center space-x-3">
    //                 <input
    //                     type="text"
    //                     value={item}
    //                     onChange={(e) => handleArrayChange(field, e.target.value, index)}
    //                     className={`flex-1 px-4 py-2 rounded-lg border ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'
    //                         } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
    //                     placeholder={`${placeholder} ${index + 1}`}
    //                 />
    //                 {formData[field].length > 1 && (
    //                     <button
    //                         type="button"
    //                         onClick={() => handleRemoveArrayItem(field, index)}
    //                         className="text-red-500 hover:text-red-700"
    //                     >
    //                         Remove
    //                     </button>
    //                 )}
    //             </div>
    //         ))}
    //     </div>
    // );

    return (
        <div className={`min-h-screen transition-all duration-300 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
            {/* Header */}
            <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} shadow-sm`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                                <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                    💻 Create Hackathon
                                </h1>
                                <p className={`mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                    Organize an exciting hackathon for students
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
                                <p className="font-semibold">Hackathon Created Successfully!</p>
                                <p className="text-sm opacity-90">The hackathon has been saved as draft.</p>
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
                            {/* Section 1: Basic Hackathon Info */}
                            <div>
                                <h2 className={`text-xl font-bold mb-6 pb-3 border-b ${theme === 'light' ? 'text-gray-800 border-gray-200' : 'text-white border-gray-700'}`}>
                                    1. Basic Hackathon Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Title */}
                                    <div className="md:col-span-2">
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Hackathon Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.title ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                            placeholder="e.g., AI Innovation Challenge 2024"
                                        />
                                        {errors.title && (
                                            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                                        )}
                                    </div>

                                    {/* Hackathon Type */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Hackathon Type *
                                        </label>
                                        <div className="space-y-2">
                                            {hackathonTypes.map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, hackathonType: type }))}
                                                    className={`w-full px-4 py-3 rounded-lg border transition-all flex items-center space-x-3 ${formData.hackathonType === type
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent'
                                                        : errors.hackathonType
                                                            ? 'border-red-500 hover:border-red-600'
                                                            : theme === 'light'
                                                                ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                                                : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                                                        }`}
                                                >
                                                    <span className="text-xl">
                                                        {type.includes('24') ? '⏰' :
                                                            type.includes('48') ? '🕐' : '🎯'}
                                                    </span>
                                                    <span>{type}</span>
                                                </button>
                                            ))}
                                        </div>
                                        {errors.hackathonType && (
                                            <p className="mt-1 text-sm text-red-500">{errors.hackathonType}</p>
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
                                                            mode === 'Online' ? '💻' : '🌐'}
                                                    </span>
                                                    <span>{mode}</span>
                                                </button>
                                            ))}
                                        </div>
                                        {errors.mode && (
                                            <p className="mt-1 text-sm text-red-500">{errors.mode}</p>
                                        )}
                                    </div>

                                    {/* Theme */}
                                    <div className="md:col-span-2">
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Theme (Optional)
                                        </label>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {themeSuggestions.slice(0, 6).map((themeSuggestion) => (
                                                <button
                                                    key={themeSuggestion}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, theme: themeSuggestion }))}
                                                    className={`px-3 py-2 rounded-lg border text-sm ${formData.theme === themeSuggestion
                                                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                                                        : theme === 'light'
                                                            ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                            : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                                        }`}
                                                >
                                                    {themeSuggestion}
                                                </button>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            name="theme"
                                            value={formData.theme}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                            placeholder="Or enter a custom theme..."
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
                                            placeholder="Detailed description about the hackathon..."
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
                                    {/* Start Date */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Start Date & Time *
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.startDate ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                        />
                                        {errors.startDate && (
                                            <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
                                        )}
                                    </div>

                                    {/* End Date */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            End Date & Time *
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.endDate ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                        />
                                        {errors.endDate && (
                                            <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
                                        )}
                                    </div>

                                    {/* Duration */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Duration *
                                        </label>
                                        <input
                                            type="text"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.duration ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                            placeholder="e.g., 24 Hours, 48 Hours"
                                        />
                                        {errors.duration && (
                                            <p className="mt-1 text-sm text-red-500">{errors.duration}</p>
                                        )}
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
                                                    placeholder="e.g., Tech Lab, Auditorium"
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
                                                    placeholder="e.g., Room 101, Lab 3"
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
                                                placeholder="e.g., Discord, Zoom, Gather.town"
                                            />
                                            {errors.onlinePlatform && (
                                                <p className="mt-1 text-sm text-red-500">{errors.onlinePlatform}</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section 4: Team Rules */}
                            <div>
                                <h2 className={`text-xl font-bold mb-6 pb-3 border-b ${theme === 'light' ? 'text-gray-800 border-gray-200' : 'text-white border-gray-700'}`}>
                                    4. Team Rules
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {/* Team Size */}
                                    <div>
                                        <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Team Size
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                                    Minimum
                                                </label>
                                                <input
                                                    type="number"
                                                    name="teamSize.min"
                                                    value={formData.teamSize.min}
                                                    onChange={handleInputChange}
                                                    min="1"
                                                    max="10"
                                                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.teamSize ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                        } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                                />
                                            </div>
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                                    Maximum
                                                </label>
                                                <input
                                                    type="number"
                                                    name="teamSize.max"
                                                    value={formData.teamSize.max}
                                                    onChange={handleInputChange}
                                                    min="1"
                                                    max="10"
                                                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors.teamSize ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                        } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                                />
                                            </div>
                                        </div>
                                        {errors.teamSize && (
                                            <p className="mt-1 text-sm text-red-500">{errors.teamSize}</p>
                                        )}
                                    </div>

                                    {/* Allowed Branches */}
                                    <div>
                                        <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Allowed Branches
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {branchOptions.slice(0, 6).map((branch) => (
                                                <button
                                                    key={branch}
                                                    type="button"
                                                    onClick={() => handleBranchToggle(branch)}
                                                    className={`px-3 py-2 rounded-lg border transition-all text-sm ${formData.allowedBranches.includes(branch)
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

                                    {/* Allowed Years */}
                                    <div>
                                        <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Allowed Years
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {yearOptions.map((year) => (
                                                <button
                                                    key={year}
                                                    type="button"
                                                    onClick={() => handleYearToggle(year)}
                                                    className={`px-3 py-2 rounded-lg border transition-all text-sm ${formData.allowedYears.includes(year)
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

                            {/* Section 5: Registration Details */}
                            <div>
                                <h2 className={`text-xl font-bold mb-6 pb-3 border-b ${theme === 'light' ? 'text-gray-800 border-gray-200' : 'text-white border-gray-700'}`}>
                                    5. Registration Details
                                </h2>

                                <div className="space-y-6">
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
                                                    placeholder="Amount per team"
                                                    min="0"
                                                />
                                            </div>
                                        )}

                                        {/* Total Teams */}
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                                Total Teams (Optional)
                                            </label>
                                            <input
                                                type="number"
                                                name="totalTeams"
                                                value={formData.totalTeams}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-lg border transition-colors ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                    } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                                placeholder="Maximum number of teams"
                                                min="1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 6: Evaluation & Rules */}


                            {/* Section 7: Rewards */}
                            <div>
                                <h2 className={`text-xl font-bold mb-6 pb-3 border-b ${theme === 'light' ? 'text-gray-800 border-gray-200' : 'text-white border-gray-700'}`}>
                                    7. Rewards & Prizes
                                </h2>

                                <div className="space-y-6">
                                    {/* Prizes */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                                🥇 First Prize
                                            </label>
                                            <input
                                                type="text"
                                                name="prizes.firstPrize"
                                                value={formData.prizes.firstPrize}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-lg border transition-colors ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                    } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                                placeholder="e.g., ₹50,000 + Internship"
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                                🥈 Second Prize
                                            </label>
                                            <input
                                                type="text"
                                                name="prizes.secondPrize"
                                                value={formData.prizes.secondPrize}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-lg border transition-colors ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                    } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                                placeholder="e.g., ₹30,000"
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                                🥉 Third Prize
                                            </label>
                                            <input
                                                type="text"
                                                name="prizes.thirdPrize"
                                                value={formData.prizes.thirdPrize}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-lg border transition-colors ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                    } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                                placeholder="e.g., ₹20,000"
                                            />
                                        </div>
                                    </div>

                                    {/* Certificate Provided */}
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            id="certificateProvided"
                                            name="certificateProvided"
                                            checked={formData.certificateProvided}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 rounded"
                                        />
                                        <label htmlFor="certificateProvided" className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Provide participation certificates to all participants
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Section 8: Organizer Info */}
                            <div>
                                <h2 className={`text-xl font-bold mb-6 pb-3 border-b ${theme === 'light' ? 'text-gray-800 border-gray-200' : 'text-white border-gray-700'}`}>
                                    8. Organizer Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Organizer Name */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Organizer Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="organizer.name"
                                            value={formData.organizer.name}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors['organizer.name'] ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                            placeholder="Full name"
                                        />
                                        {errors['organizer.name'] && (
                                            <p className="mt-1 text-sm text-red-500">{errors['organizer.name']}</p>
                                        )}
                                    </div>

                                    {/* Department */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Department
                                        </label>
                                        <input
                                            type="text"
                                            name="organizer.department"
                                            value={formData.organizer.department}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                            placeholder="e.g., CSE Department, Coding Club"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            name="organizer.phone"
                                            value={formData.organizer.phone}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                            placeholder="Phone number"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="organizer.email"
                                            value={formData.organizer.email}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-lg border transition-colors ${errors['organizer.email'] ? 'border-red-500' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                                                } ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
                                            placeholder="email@example.com"
                                        />
                                        {errors['organizer.email'] && (
                                            <p className="mt-1 text-sm text-red-500">{errors['organizer.email']}</p>
                                        )}
                                    </div>
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
                                                <span>Creating Hackathon...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>💻</span>
                                                <span>Create Hackathon</span>
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

export default CreateHackathon;
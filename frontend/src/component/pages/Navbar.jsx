import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../Context/TheamContext";
import ThemeToggle from "./TheamToggle";
import axios from 'axios'

const Navbar = () => {
    // ================= STATES =================
    const [showRegister, setShowRegister] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [hoverTimeout, setHoverTimeout] = useState(null);
    const dropdownRefs = useRef({});

    const location = useLocation();
    const navigate = useNavigate();

    const { theme, user, logout } = useTheme();

    const navItems = [{ name: "Home", path: "/", hasDropdown: false }, { name: "Events", path: "/events", hasDropdown: true, dropdown: [{ name: "Upcoming", path: "/events/upcoming", count: 8 }, { name: "Past Events", path: "/events/past", count: 12 },] }, { name: "Gallery", path: "/gallery", hasDropdown: true, dropdown: [{ name: "Photos", path: "/gallery/photos", count: 45 }, { name: "Videos", path: "/gallery/videos", count: 12 }, { name: "Memories", path: "/gallery/memories", count: 23 },] }, { name: "Sponsors", path: "/sponsors", hasDropdown: true, dropdown: [{ name: "Gold Sponsors", path: "/sponsors/gold", count: 5 }, { name: "Silver Sponsors", path: "/sponsors/silver", count: 8 }, { name: "Bronze Sponsors", path: "/sponsors/bronze", count: 15 },] }, { name: "Contact", path: "/contact", hasDropdown: true, dropdown: [{ name: "Support", path: "/contact/support", count: 2 }, { name: "Feedback", path: "/contact/feedback", count: 7 }, { name: "Emergency", path: "/contact/emergency", count: 1 },] }, { name: "About", path: "/about", hasDropdown: true, dropdown: [{ name: "Our Team", path: "/about/team", count: 0 }, { name: "Mission", path: "/about/mission", count: 0 }, { name: "History", path: "/about/history", count: 0 },] },];

    // ================= ADMIN STATE =================
    const [admin, setAdmin] = useState(() => {
        const data = localStorage.getItem("adminData");
        return data ? JSON.parse(data) : null;
    });

    // ================= ORGANISER STATE =================
    const [organiser, setOrganiser] = useState(() => {
        const data = localStorage.getItem("OrgainserData");
        return data ? JSON.parse(data) : null;
    });

    // ================= USER ROLE =================
    const getUserRole = () => {
        if (admin) return { role: "admin", data: admin };
        if (organiser) return { role: "organiser", data: organiser };
        if (user) return { role: "student", data: user };
        return null;
    };

    const userRole = getUserRole();

    // ================= ADMIN LOGOUT =================
    const AdminLogOut = () => {
        setAdmin(null);

        localStorage.removeItem("adminData");
        localStorage.removeItem("adminToken");

        delete axios.defaults.headers.common["Authorization"];
    };

    // ================= ORGANISER LOGOUT =================
    const OrganiserLogout = () => {
        setOrganiser(null);

        localStorage.removeItem("OrgainserData");
        localStorage.removeItem("OrgainserToken");

        delete axios.defaults.headers.common["Authorization"];
    };

    // ================= HANDLE LOGOUT =================
    const handleLogout = () => {
        try {
            const role = userRole?.role;

            if (role === "admin") {
                AdminLogOut();
            } else if (role === "organiser") {
                OrganiserLogout();
            } else if (role === "student") {
                logout();
            }

            localStorage.removeItem("userData");
            navigate("/");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    // ================= USER INFO =================
    const getUserInfo = () => {
        if (!userRole) return null;

        if (userRole.role === "admin") {
            return {
                name: admin?.name || admin?.email || "Admin",
                avatar: admin?.avatar || "https://via.placeholder.com/40",
            };
        }

        if (userRole.role === "organiser") {
            return {
                name: organiser?.name || organiser?.email || "Organiser",
                avatar: organiser?.avatar || "https://via.placeholder.com/40",
            };
        }

        if (userRole.role === "student") {
            return {
                name: user?.name || user?.email || "Student",
                avatar: user?.avatar || "https://via.placeholder.com/40",
            };
        }

        return null;
    };

    const userInfo = getUserInfo();

    // ================= UI HELPERS =================
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const isActive = (path) => location.pathname === path;

    const handleMouseEnter = (itemName) => {
        if (hoverTimeout) clearTimeout(hoverTimeout);
        setOpenDropdown(itemName);
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => setOpenDropdown(null), 150);
        setHoverTimeout(timeout);
    };

    const handleDropdownItemClick = (path) => {
        navigate(path);
        setOpenDropdown(null);
        setIsMenuOpen(false);
    };

    // ================= CLICK OUTSIDE =================
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                openDropdown &&
                dropdownRefs.current[openDropdown] &&
                !dropdownRefs.current[openDropdown].contains(event.target)
            ) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            if (hoverTimeout) clearTimeout(hoverTimeout);
        };
    }, [openDropdown, hoverTimeout]);

    return (
        <>
            <style jsx global>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>

            <nav className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${theme === "light"
                ? "bg-white/95 border-b border-gray-200 shadow-lg"
                : "bg-gray-900/95 border-b border-gray-800 shadow-xl"
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo Section */}
                        <div className="flex-shrink-0">
                            <Link to="/" className="flex items-center">
                                <div className="flex items-baseline">
                                    <span className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"
                                        }`}>
                                        College
                                    </span>
                                    <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-1">
                                        Events
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation with Dropdowns */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-2">
                                {navItems.map((item) => (
                                    <div
                                        key={item.name}
                                        className="relative"
                                        ref={(el) => (dropdownRefs.current[item.name] = el)}
                                        onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.name)}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        {item.hasDropdown ? (
                                            <div className="relative">
                                                <button
                                                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg flex items-center space-x-2 ${theme === "light"
                                                        ? isActive(item.path)
                                                            ? "text-blue-600 bg-blue-50"
                                                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                                        : isActive(item.path)
                                                            ? "text-blue-400 bg-gray-800"
                                                            : "text-gray-300 hover:text-blue-400 hover:bg-gray-800"
                                                        }`}
                                                >
                                                    <span>{item.name}</span>
                                                    {item.dropdown.some(subItem => subItem.count > 0) && (
                                                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white animate-pulse">
                                                            {item.dropdown.filter(subItem => subItem.count > 0).length}
                                                        </span>
                                                    )}
                                                </button>

                                                {openDropdown === item.name && (
                                                    <div className={`absolute top-full left-0 mt-1 w-64 rounded-lg shadow-xl py-2 z-50 animate-fadeIn ${theme === "light"
                                                        ? "bg-white border border-gray-200"
                                                        : "bg-gray-800 border border-gray-700"
                                                        }`}>
                                                        {item.dropdown.map((subItem) => (
                                                            <button
                                                                key={subItem.name}
                                                                onClick={() => handleDropdownItemClick(subItem.path)}
                                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === "light" ? "#eff6ff" : "#374151"}
                                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                                                className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors duration-150 cursor-pointer ${theme === "light"
                                                                    ? "text-gray-700"
                                                                    : "text-gray-300"
                                                                    } ${isActive(subItem.path) ? "bg-blue-500 bg-opacity-10" : ""}`}
                                                            >
                                                                <div className="flex items-center space-x-3">
                                                                    <div className={`w-2 h-2 rounded-full ${isActive(subItem.path)
                                                                        ? "bg-blue-500"
                                                                        : theme === "light"
                                                                            ? "bg-gray-300"
                                                                            : "bg-gray-600"
                                                                        }`}></div>
                                                                    <span className="font-medium">{subItem.name}</span>
                                                                </div>
                                                                {subItem.count > 0 && (
                                                                    <span className={`flex items-center justify-center min-w-6 h-6 px-1 rounded-full text-xs font-semibold ${subItem.count > 5
                                                                        ? "bg-red-500 text-white"
                                                                        : subItem.count > 2
                                                                            ? "bg-orange-500 text-white"
                                                                            : "bg-green-500 text-white"
                                                                        }`}>
                                                                        {subItem.count}
                                                                    </span>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <Link
                                                to={item.path}
                                                className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${theme === "light"
                                                    ? isActive(item.path)
                                                        ? "text-blue-600 bg-blue-50"
                                                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                                    : isActive(item.path)
                                                        ? "text-blue-400 bg-gray-800"
                                                        : "text-gray-300 hover:text-blue-400 hover:bg-gray-800"
                                                    }`}
                                            >
                                                {item.name}
                                                {isActive(item.path) && (
                                                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
                                                )}
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Side Controls */}
                        <div className="hidden md:flex items-center space-x-4">
                            <ThemeToggle />

                            {!userRole ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowRegister(!showRegister)}
                                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 
                                            text-white font-semibold rounded-lg 
                                            hover:from-blue-700 hover:to-purple-700 
                                            transition-all duration-300 transform hover:-translate-y-0.5 
                                            shadow-lg hover:shadow-xl"
                                    >
                                        Register Now
                                    </button>

                                    {showRegister && (
                                        <div
                                            className="absolute right-0 mt-2 w-44 
                                                bg-white dark:bg-gray-800 
                                                border border-gray-200 dark:border-gray-700
                                                rounded-lg shadow-lg z-50"
                                        >
                                            <button
                                                onClick={() => navigate("/AdminRegsiterPage")}
                                                className="w-full px-4 py-2 text-left 
                                                    text-gray-700 dark:text-gray-200
                                                    hover:bg-gray-100 dark:hover:bg-gray-700
                                                    rounded-t-lg"
                                            >
                                                Admin
                                            </button>
                                            <button
                                                onClick={() => navigate("/login")}
                                                className="w-full px-4 py-2 text-left 
                                                    text-gray-700 dark:text-gray-200
                                                    hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                Student
                                            </button>
                                            <button
                                                onClick={() => navigate("/OrganiserRegsiterPage")}
                                                className="w-full px-4 py-2 text-left 
                                                    text-gray-700 dark:text-gray-200
                                                    hover:bg-gray-100 dark:hover:bg-gray-700
                                                    rounded-b-lg"
                                            >
                                                Organizer
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="relative group">
                                    {/* User Info with Role Badge */}
                                    <div className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-medium rounded-lg shadow-sm cursor-pointer">
                                        <img
                                            src={userInfo?.avatar || "https://via.placeholder.com/40"}
                                            alt={userInfo?.name}
                                            className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm">{userInfo?.name}</span>
                                            <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-0.5 rounded-full capitalize">
                                                {userRole?.role}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Dropdown */}
                                    <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center space-x-3">
                            <ThemeToggle />
                            <button
                                onClick={toggleMenu}
                                className={`inline-flex items-center justify-center p-2 rounded-md transition-colors duration-200 ${theme === "light"
                                    ? "text-gray-700 hover:bg-gray-100"
                                    : "text-gray-300 hover:bg-gray-800"
                                    }`}
                                aria-label="Toggle menu"
                            >
                                <div className="space-y-1.5">
                                    <span className={`block w-6 h-0.5 transition-all duration-300 ${theme === "light" ? "bg-gray-900" : "bg-white"
                                        } ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
                                    <span className={`block w-6 h-0.5 transition-all duration-300 ${theme === "light" ? "bg-gray-900" : "bg-white"
                                        } ${isMenuOpen ? "opacity-0" : ""}`}></span>
                                    <span className={`block w-6 h-0.5 transition-all duration-300 ${theme === "light" ? "bg-gray-900" : "bg-white"
                                        } ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu - FIXED WITH SCROLLABLE CONTENT */}
                <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen
                    ? "max-h-screen opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                    }`}>
                    {/* Fixed height container with overflow */}
                    <div className={`max-h-[80vh] overflow-y-auto overscroll-contain ${theme === "light"
                        ? "bg-white border-t border-gray-200"
                        : "bg-gray-900 border-t border-gray-800"
                        }`}>
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {navItems.map((item) => (
                                <div key={item.name}>
                                    {item.hasDropdown ? (
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between px-4 py-3 rounded-lg">
                                                <span className={`text-base font-medium ${theme === "light"
                                                    ? "text-gray-700"
                                                    : "text-gray-300"
                                                    }`}>
                                                    {item.name}
                                                </span>
                                                {item.dropdown.some(subItem => subItem.count > 0) && (
                                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                                                        {item.dropdown.filter(subItem => subItem.count > 0).length}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="ml-4 pl-4 border-l-2 border-gray-300 space-y-1">
                                                {item.dropdown.map((subItem) => (
                                                    <button
                                                        key={subItem.name}
                                                        onClick={() => handleDropdownItemClick(subItem.path)}
                                                        className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${theme === "light"
                                                            ? "text-gray-600 hover:bg-gray-100"
                                                            : "text-gray-400 hover:bg-gray-800"
                                                            } ${isActive(subItem.path) ? "bg-blue-500 bg-opacity-10" : ""}`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span>{subItem.name}</span>
                                                            {subItem.count > 0 && (
                                                                <span className={`flex items-center justify-center min-w-6 h-6 px-1 rounded-full text-xs font-semibold ${subItem.count > 5
                                                                    ? "bg-red-500 text-white"
                                                                    : subItem.count > 2
                                                                        ? "bg-orange-500 text-white"
                                                                        : "bg-green-500 text-white"
                                                                    }`}>
                                                                    {subItem.count}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            to={item.path}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${theme === "light"
                                                ? isActive(item.path)
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "text-gray-700 hover:bg-gray-100"
                                                : isActive(item.path)
                                                    ? "bg-gray-800 text-blue-400"
                                                    : "text-gray-300 hover:bg-gray-800"
                                                }`}
                                        >
                                            {item.name}
                                            {isActive(item.path) && (
                                                <span className="ml-2 inline-block w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
                                            )}
                                        </Link>
                                    )}
                                </div>
                            ))}

                            {/* Mobile Register/User Section */}
                            <div className="pt-4 mt-4 border-t border-gray-700">
                                {!userRole ? (
                                    <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg">
                                        Register Now
                                    </button>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3 px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
                                            <img
                                                src={userInfo?.avatar || "https://via.placeholder.com/40"}
                                                alt={userInfo?.name}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                                            />
                                            <div>
                                                <div className="font-medium text-gray-800 dark:text-gray-100">
                                                    {userInfo?.name}
                                                </div>
                                                <div className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-0.5 rounded-full capitalize inline-block">
                                                    {userRole?.role}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-3 text-red-600 dark:text-red-400 font-semibold rounded-lg border border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;

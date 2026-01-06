import React , {useState , useEffect} from 'react';
 import axios from 'axios';

import {
    Users,
    Trophy,
    Music,
    Palette,
    Mic,
    Wrench,
    Calendar,
    MapPin,
    Award,
    Star,
    Heart,
    Sparkles
} from 'lucide-react';
import { useTheme } from '../Context/TheamContext';
// import { Trophy, Music, Wrench, Palette, Calendar, Users } from "lucide-react";
const TeamPage = () => {
     const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    // Event organizing team members with their specific roles
 



    useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/teammember/getAllTeammember"
        );

          console.log("098765434567890-987654567890-098765" , response.data.data)

        // Adjust according to your API response shape
        setTeamMembers(response.data.data || []);
      } catch (error) {
        console.error("Error fetching team members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);


  const iconMap = (member) => {
  if (member.specialization?.includes("Sports")) return <Trophy className="w-5 h-5" />;
  if (member.specialization?.includes("Cultural")) return <Music className="w-5 h-5" />;
  if (member.specialization?.includes("Technical")) return <Wrench className="w-5 h-5" />;
  if (member.specialization?.includes("Decoration")) return <Palette className="w-5 h-5" />;
  if (member.specialization?.includes("Logistics")) return <Calendar className="w-5 h-5" />;
  return <Users className="w-5 h-5" />;
};


    // Team statistics
    const teamStats = [
        { value: "150+", label: "Events Organized", icon: "🎯" },
        { value: "6", label: "Team Members", icon: "👥" },
        { value: "2000+", label: "Students Reached", icon: "🎓" },
        { value: "50+", label: "Volunteers", icon: "🤝" },
    ];

    // Event types organized
    const eventTypes = [
        { name: "Sports Events", count: 45, color: "from-red-500 to-orange-500" },
        { name: "Cultural Events", count: 38, color: "from-purple-500 to-pink-500" },
        { name: "Technical Events", count: 32, color: "from-blue-500 to-cyan-500" },
        { name: "Workshops", count: 25, color: "from-green-500 to-emerald-500" },
        { name: "Seminars", count: 18, color: "from-yellow-500 to-amber-500" },
    ];

    return (
        <div className={`min-h-screen transition-all duration-300 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>

            {/* Wave Hero Section */}
            <div className="relative overflow-hidden">
                {/* Wave Background */}
                <div className="absolute inset-0">
                    <svg
                        className="w-full h-full"
                        viewBox="0 0 1440 320"
                        preserveAspectRatio="none"
                    >
                        <path
                            fill={theme === 'light' ? "#3b82f6" : "#1e3a8a"}
                            fillOpacity="0.1"
                            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        ></path>
                    </svg>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
                    <div className="text-center">
                        {/* Team Badge */}
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
        className={`text-sm font-medium
          ${theme === 'light' ? 'text-blue-800' : 'text-white'}`}
      >
        Event Organizing Team
      </span>
    </div>


                        <h1
                            className={`text-4xl md:text-5xl font-bold mb-6
        ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}
                        >
                            Meet Our Event
                            <span className="block bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                                Organizing Heroes
                            </span>
                        </h1>

                        <p
                            className={`text-xl mb-8 max-w-3xl mx-auto
        ${theme === 'light' ? 'text-gray-600' : 'text-white/80'}`}
                        >
                            The passionate students who work tirelessly behind the scenes to make every
                            college event memorable, exciting, and successful.
                        </p>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg
                        className="w-full h-20"
                        viewBox="0 0 1440 120"
                        preserveAspectRatio="none"
                    >
                        <path
                            fill={theme === 'light' ? "#ffffff" : "#111827"}
                            d="M0,0L48,10.7C96,21,192,43,288,48C384,53,480,43,576,37.3C672,32,768,32,864,48C960,64,1056,96,1152,101.3C1248,107,1344,85,1392,74.7L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
                        ></path>
                    </svg>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative -mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Team Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                        {teamStats.map((stat, index) => (
                            <div
                                key={index}
                                className={`p-6 rounded-2xl text-center backdrop-blur-sm border ${theme === 'light'
                                    ? 'bg-white/80 border-gray-200'
                                    : 'bg-gray-800/80 border-gray-700'
                                    }`}
                            >
                                <div className="text-3xl mb-2">{stat.icon}</div>
                                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                                <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Event Types Organized */}
                    <div className="mb-16">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold mb-2">Events We've Organized</h2>
                            <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                Types of events managed by our team
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {eventTypes.map((eventType, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-xl text-center ${theme === 'light'
                                        ? 'bg-gray-50 border border-gray-200'
                                        : 'bg-gray-800 border border-gray-700'
                                        }`}
                                >
                                    <div className={`text-2xl font-bold bg-gradient-to-r ${eventType.color} bg-clip-text text-transparent mb-2`}>
                                        {eventType.count}
                                    </div>
                                    <div className="text-sm font-medium">{eventType.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Team Members Grid */}
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-2">Our Core Team Members</h2>
                            <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                The dedicated students who make events happen
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                           {teamMembers.map((member) => (
  <div
    key={member._id}   // ✅ MongoDB safe key
    className={`relative rounded-2xl overflow-hidden group ${
      theme === "light"
        ? "bg-gradient-to-b from-white to-gray-50"
        : "bg-gradient-to-b from-gray-800 to-gray-900"
    } border ${
      theme === "light" ? "border-gray-200" : "border-gray-700"
    } hover:shadow-2xl transition-all duration-500`}
  >
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-5">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, ${
            theme === "light" ? "#000" : "#fff"
          } 2%, transparent 0%)`,
          backgroundSize: "50px 50px",
        }}
      />
    </div>

    {/* Member Header */}
    <div className="relative p-6">
      <div className="flex items-start space-x-4 mb-4">
        {/* Avatar */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
            <img
              src={member.avatar}
              alt={member.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Icon */}
          <div
            className={`absolute -bottom-1 -right-1 p-2 rounded-full border-4 ${
              theme === "light"
                ? "bg-white border-white"
                : "bg-gray-800 border-gray-800"
            }`}
          >
            <div
              className={`p-1.5 rounded-full ${
                member.specialization?.includes("Sports")
                  ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                  : member.specialization?.includes("Cultural")
                  ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                  : member.specialization?.includes("Technical")
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
              }`}
            >
              {iconMap(member)}
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1">{member.name}</h3>
          <div
            className={`text-sm font-semibold mb-1 ${
              theme === "light" ? "text-blue-600" : "text-blue-400"
            }`}
          >
            {member.role}
          </div>
          <div
            className={`text-xs ${
              theme === "light" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {member.department} • {member.year}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        className={`flex items-center justify-between p-3 rounded-lg mb-4 ${
          theme === "light"
            ? "bg-blue-50 border border-blue-100"
            : "bg-blue-900/20 border border-blue-800/30"
        }`}
      >
        <div className="text-center">
          <div className="text-2xl font-bold">{member.eventsOrganized}</div>
          <div className="text-xs text-gray-500">Events</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold">
            {member.achievements?.length || 0}
          </div>
          <div className="text-xs text-gray-500">Awards</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold">
            {member.specialization?.split(" ")[0]}
          </div>
          <div className="text-xs text-gray-500">Specialty</div>
        </div>
      </div>

      {/* Contribution */}
      <p className="text-sm text-gray-600 mb-4">
        {member.contribution}
      </p>

      {/* Achievements */}
      <div className="flex flex-wrap gap-2 mb-4">
        {member.achievements?.map((achievement, idx) => (
          <span
            key={idx}
            className={`px-2 py-1 rounded text-xs ${
              theme === "light"
                ? "bg-green-100 text-green-700"
                : "bg-green-900/30 text-green-400"
            }`}
          >
            {achievement}
          </span>
        ))}
      </div>

      {/* Motto */}
      <div
        className={`p-3 rounded-lg italic text-sm ${
          theme === "light"
            ? "bg-gray-50 text-gray-600"
            : "bg-gray-800/50 text-gray-300"
        }`}
      >
        “{member.motto}”
      </div>
    </div>
  </div>
))}

                        </div>
                    </div>

                    {/* Team Contribution Section */}
                    <div className="relative mb-20 overflow-hidden rounded-3xl">
                        {/* Wave Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600">
                            <div className="absolute inset-0 opacity-10">
                                <svg
                                    className="w-full h-full"
                                    viewBox="0 0 500 500"
                                    preserveAspectRatio="none"
                                >
                                    <path
                                        fill="white"
                                        d="M0,100 C150,200 350,0 500,100 L500,500 L0,500 Z"
                                    ></path>
                                </svg>
                            </div>
                        </div>

                        <div className="relative z-10 p-12 text-center text-white">
                            <div className="inline-flex p-3 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                                <Users className="w-8 h-8" />
                            </div>

                            <h2 className="text-3xl font-bold mb-6">Teamwork Makes Events Work</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                                <div className="text-center">
                                    <div className="text-4xl font-bold mb-2">150+</div>
                                    <div className="text-white/80">Events Organized</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold mb-2">6</div>
                                    <div className="text-white/80">Dedicated Teams</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold mb-2">100%</div>
                                    <div className="text-white/80">Student Satisfaction</div>
                                </div>
                            </div>

                            <p className="mt-8 text-white/90 max-w-2xl mx-auto">
                                From venue decoration to technical setup, from volunteer coordination to
                                cultural performances - every team member plays a crucial role in making
                                college events successful and memorable.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Wave Footer */}
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

export default TeamPage;
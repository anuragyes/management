import React, { useState } from 'react';
import { Calendar, MapPin, Search, X, Users, Clock, CheckCircle } from 'lucide-react';

const CollegeEventsPage = () => {
  const [filter, setFilter] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const events = [
    {
      id: 1,
      title: "Tech-Nova Hackathon",
      date: "Oct 15, 2025",
      time: "10:00 AM - 05:00 PM",
      location: "Main IT Lab",
      category: "Technical",
      description: "A 24-hour marathon where you build solutions for real-world problems. Great for networking and winning cool gadgets!",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
      color: "bg-blue-100 text-blue-700"
    },
    {
      id: 2,
      title: "Sunburn Campus Fest",
      date: "Oct 20, 2025",
      time: "06:00 PM - 11:00 PM",
      location: "Open Air Theater",
      category: "Cultural",
      description: "The biggest music festival on campus featuring local bands and a surprise celebrity DJ. Food stalls included!",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
      color: "bg-purple-100 text-purple-700"
    },
    {
      id: 3,
      title: "Inter-College Cricket",
      date: "Oct 22, 2025",
      time: "09:00 AM onwards",
      location: "Sports Ground",
      category: "Sports",
      description: "Cheer for our home team as they battle against the city rivals. Free jerseys for the first 50 spectators!",
      image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800",
      color: "bg-green-100 text-green-700"
    }
  ];

  const categories = ['All', 'Technical', 'Cultural', 'Sports'];

  const handleRegister = (e) => {
    e.preventDefault();
    setIsRegistered(true);
    setTimeout(() => {
      setIsRegistered(false);
      setSelectedEvent(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-indigo-600 py-12 px-6 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-2">Campus Events</h1>
        <p className="text-indigo-100">Don't just study, make memories.</p>
      </header>

      {/* Navigation & Search */}
      <div className="max-w-6xl mx-auto px-6 -mt-6">
        <div className="bg-white rounded-xl shadow-md p-3 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  filter === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-6xl mx-auto px-6 mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events
          .filter(e => filter === 'All' || e.category === filter)
          .map((event) => (
          <div key={event.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-indigo-300 transition-all hover:shadow-2xl">
            <div className="h-44 overflow-hidden relative">
              <img src={event.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className={`absolute top-4 left-4 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-white text-slate-900 shadow-sm`}>
                {event.category}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold mb-2">{event.title}</h3>
              <div className="flex items-center text-slate-500 text-xs mb-4">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                {event.date}
              </div>
              <button 
                onClick={() => setSelectedEvent(event)}
                className="w-full py-2.5 bg-slate-50 text-indigo-600 border border-indigo-100 rounded-lg font-bold hover:bg-indigo-600 hover:text-white transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Modal Backdrop */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedEvent(null)} />
          
          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white z-10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Event Info Sidebar */}
              <div className="md:w-1/2 bg-indigo-600 text-white p-8">
                <span className="text-xs font-bold uppercase tracking-widest bg-indigo-500 px-3 py-1 rounded-full">
                  {selectedEvent.category}
                </span>
                <h2 className="text-3xl font-bold mt-4 mb-6">{selectedEvent.title}</h2>
                <div className="space-y-4 text-indigo-100">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-5 h-5 mr-3" /> {selectedEvent.date}
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-5 h-5 mr-3" /> {selectedEvent.time}
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-5 h-5 mr-3" /> {selectedEvent.location}
                  </div>
                </div>
                <p className="mt-8 text-sm leading-relaxed text-indigo-50">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Registration Form */}
              <div className="md:w-1/2 p-8 bg-white">
                {!isRegistered ? (
                  <>
                    <h3 className="text-xl font-bold mb-6 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-indigo-600" />
                      Register Now
                    </h3>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                        <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Student Email</label>
                        <input required type="email" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="john@college.edu" />
                      </div>
                      <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95">
                        Confirm Registration
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Registered!</h3>
                    <p className="text-slate-500 mt-2">Check your email for the ticket.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeEventsPage;
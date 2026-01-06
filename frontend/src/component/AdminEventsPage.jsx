import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AdminEvent, AdminEventCatogry, AdminEventState } from '../ApiInstance/Allapis';

const AdminEventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

 

  
  // API Endpoints
  const API_ENDPOINTS = {
    events: AdminEvent,
    categories: AdminEventCatogry,
    stats: AdminEventState,
  };

  // Event status options
  const statusOptions = [
    { id: 'all', name: 'All Status', color: 'gray' },
    { id: 'upcoming', name: 'Upcoming', color: 'blue' },
    { id: 'ongoing', name: 'Ongoing', color: 'green' },
    { id: 'completed', name: 'Completed', color: 'gray' },
    { id: 'cancelled', name: 'Cancelled', color: 'red' }
  ];

  // Event categories (will be fetched from API)
  const [categories, setCategories] = useState([
    { id: 'all', name: 'All Categories' },
    { id: 'sports', name: 'Sports' },
    { id: 'hackathon', name: 'Hackathon' },
    { id: 'cultural', name: 'Cultural' },
    { id: 'seminars', name: 'Seminars' },
    { id: 'workshops', name: 'Workshops' },
    { id: 'startup', name: 'Startup' }
  ]);

  // Fetch events on component mount and when filters change
  useEffect(() => {
    fetchEvents();
    fetchCategories();
    fetchStats();
  }, [currentPage, selectedCategory, selectedStatus, searchQuery]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
      });

      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const url = `${API_ENDPOINTS.events}?${params.toString()}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEvents(data.events || []);
      setTotalPages(data.totalPages || 1);
      setTotalEvents(data.totalEvents || 0);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.categories, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCategories([
          { id: 'all', name: 'All Categories' },
          ...data
        ]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.stats, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // You can use stats data if needed
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.events}/${eventToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Event deleted successfully');
        fetchEvents(); // Refresh the list
      } else {
        throw new Error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    } finally {
      setShowDeleteModal(false);
      setEventToDelete(null);
    }
  };

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setShowEditModal(true);
  };

  const handleCreateClick = () => {
    setEditingEvent(null);
    setShowCreateModal(true);
  };

  const handleViewDetails = (eventId) => {
    navigate(`/admin/events/${eventId}`);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1);
      fetchEvents();
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.events}/${eventId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success('Event status updated');
        fetchEvents(); // Refresh the list
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      sports: '⚽',
      hackathon: '💻',
      cultural: '🎭',
      seminars: '🎤',
      workshops: '🔧',
      startup: '🚀'
    };
    return icons[category] || '📅';
  };

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
        <p className="text-gray-600 mt-2">Manage all events, registrations, and event details</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Events</p>
              <p className="text-3xl font-bold text-gray-900">{totalEvents}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <span className="text-2xl">📅</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Upcoming</p>
              <p className="text-3xl font-bold text-gray-900">
                {events.filter(e => e.status === 'upcoming').length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Ongoing</p>
              <p className="text-3xl font-bold text-gray-900">
                {events.filter(e => e.status === 'ongoing').length}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <span className="text-2xl">▶️</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completed</p>
              <p className="text-3xl font-bold text-gray-900">
                {events.filter(e => e.status === 'completed').length}
              </p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-xl shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events by title, venue, or organizer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearch}
                  className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  🔍
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
              
              <button
                onClick={handleCreateClick}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                + Create Event
              </button>
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                No events found
              </h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? `No events found for "${searchQuery}"`
                  : 'Create your first event to get started'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Event</th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Participants</th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden">
                          <img
                            src={event.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=200'}
                            alt={event.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=200';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{event.title}</div>
                          <div className="text-sm text-gray-500">{event.venue}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{getCategoryIcon(event.category)}</span>
                        <span className="text-sm text-gray-900 capitalize">{event.category}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-900">{formatDate(event.date)}</div>
                      <div className="text-sm text-gray-500">{event.startTime} - {event.endTime}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <select
                          value={event.status}
                          onChange={(e) => handleStatusChange(event.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)} border-none focus:ring-2 focus:ring-blue-500`}
                        >
                          {statusOptions.filter(s => s.id !== 'all').map((status) => (
                            <option key={status.id} value={status.id} className="bg-white">
                              {status.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-900">
                        {event.registeredParticipants || 0} / {event.maxParticipants || '∞'}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ 
                            width: `${Math.min(((event.registeredParticipants || 0) / (event.maxParticipants || 1)) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(event.id)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditClick(event)}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(event)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {events.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-semibold">{(currentPage - 1) * 10 + 1}</span> to{' '}
                <span className="font-semibold">{Math.min(currentPage * 10, totalEvents)}</span> of{' '}
                <span className="font-semibold">{totalEvents}</span> events
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg ${currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg ${currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg ${currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Event</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{eventToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Event Modal */}
      {(showCreateModal || showEditModal) && (
        <CreateEditEventModal
          event={editingEvent}
          onClose={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
          }}
          onSuccess={() => {
            fetchEvents();
            setShowCreateModal(false);
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminEventsPage;
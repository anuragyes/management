// components/EventGallery.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  Camera,
  Calendar,
  MapPin,
  Users,
  Filter,
  Search,
  Grid,
  List,
  Heart,
  Share2,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Tag,
  Trophy,
  Star,
  Award,
  Image as ImageIcon,
  Play,
  Bookmark,
  Eye
} from 'lucide-react';
import { useTheme } from '../../Context/TheamContext';
// import { user } from '../../ApiInstance/Allapis';
const EventGallery = () => {
  const { theme, user } = useTheme();

  // console.log("this is user called from api files ", user)

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filter, setFilter] = useState('all'); // 'all', 'sports', 'cultural', 'tech', 'workshop'
  const [searchTerm, setSearchTerm] = useState('');
  const [likedPhotos, setLikedPhotos] = useState([]);
  const [bookmarkedPhotos, setBookmarkedPhotos] = useState([]);

  // Sample event photos data (replace with API call)
  const samplePhotos = [
    {
      id: 1,
      title: "Cricket Championship Final",
      description: "The intense final match between Engineering and Science departments",
      imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
      category: "sports",
      date: "2024-03-15",
      venue: "College Cricket Ground",
      likes: 245,
      views: 1250,
      tags: ["cricket", "championship", "final", "sports"],
      featured: true,
      eventType: "Outdoor Sports",
      photographer: "Sports Club",
      teamMembers: ["Team A", "Team B"]
    },
    {
      id: 2,
      title: "Cultural Fest Opening",
      description: "Grand opening ceremony of our annual cultural fest",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w-800&q=80",
      category: "cultural",
      date: "2024-03-10",
      venue: "Auditorium",
      likes: 189,
      views: 980,
      tags: ["cultural", "fest", "opening", "performance"],
      featured: true,
      eventType: "Cultural Event",
      photographer: "Arts Club",
      teamMembers: ["Dance Team", "Music Band"]
    },
    {
      id: 3,
      title: "Tech Hackathon Winners",
      description: "Winners showcasing their innovative project",
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w-800&q=80",
      category: "tech",
      date: "2024-03-05",
      venue: "Computer Lab",
      likes: 312,
      views: 1650,
      tags: ["hackathon", "tech", "innovation", "winners"],
      featured: true,
      eventType: "Technical Event",
      photographer: "Tech Club",
      teamMembers: ["Team Innovators", "Team Coders"]
    },
    {
      id: 4,
      title: "Football Tournament",
      description: "Inter-department football tournament action shots",
      imageUrl: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w-800&q=80",
      category: "sports",
      date: "2024-02-28",
      venue: "Football Field",
      likes: 178,
      views: 920,
      tags: ["football", "tournament", "sports", "action"],
      featured: false,
      eventType: "Outdoor Sports",
      photographer: "Sports Club",
      teamMembers: ["CS Dept", "IT Dept"]
    },
    {
      id: 5,
      title: "Robotics Workshop",
      description: "Students building and programming robots",
      imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w-800&q=80",
      category: "workshop",
      date: "2024-02-20",
      venue: "Robotics Lab",
      likes: 156,
      views: 850,
      tags: ["robotics", "workshop", "learning", "technology"],
      featured: false,
      eventType: "Workshop",
      photographer: "Robotics Club",
      teamMembers: ["Beginners Group", "Advanced Group"]
    },
    {
      id: 6,
      title: "Chess Championship",
      description: "Intense moments from the chess competition",
      imageUrl: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w-800&q=80",
      category: "sports",
      date: "2024-02-15",
      venue: "Library Hall",
      likes: 134,
      views: 720,
      tags: ["chess", "mind sports", "competition", "strategy"],
      featured: false,
      eventType: "Indoor Sports",
      photographer: "Sports Club",
      teamMembers: ["Individual Participants"]
    },
    {
      id: 7,
      title: "Annual Sports Day",
      description: "Highlights from our annual sports day celebration",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w-800&q=80",
      category: "sports",
      date: "2024-02-10",
      venue: "College Stadium",
      likes: 298,
      views: 1420,
      tags: ["sportsday", "athletics", "celebration", "awards"],
      featured: true,
      eventType: "Sports Event",
      photographer: "Media Club",
      teamMembers: ["All Departments"]
    },
    {
      id: 8,
      title: "E-Sports Tournament",
      description: "Valorant gaming competition finals",
      imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w-800&q=80",
      category: "tech",
      date: "2024-02-05",
      venue: "E-Sports Arena",
      likes: 421,
      views: 2100,
      tags: ["esports", "gaming", "valorant", "tournament"],
      featured: true,
      eventType: "E-Sports",
      photographer: "Gaming Club",
      teamMembers: ["Team Pro", "Team Elite"]
    }
  ];

  // Fetch photos from API
  const fetchPhotos = async () => {
    try {
      setLoading(true);
      //  API call
      // const response = await axios.get('http://localhost:5000/api/events/photos');
      // setPhotos(response.data);

      // Using sample data for now
      setTimeout(() => {
        setPhotos(samplePhotos);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Filter photos based on category and search term
  const filteredPhotos = photos.filter(photo => {
    if (filter !== 'all' && photo.category !== filter) return false;
    if (searchTerm && !photo.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !photo.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    return true;
  });

  // Handle like photo
  const handleLike = (photoId) => {
    if (likedPhotos.includes(photoId)) {
      setLikedPhotos(likedPhotos.filter(id => id !== photoId));
      // Update likes count
      setPhotos(photos.map(photo =>
        photo.id === photoId ? { ...photo, likes: photo.likes - 1 } : photo
      ));
    } else {
      setLikedPhotos([...likedPhotos, photoId]);
      // Update likes count
      setPhotos(photos.map(photo =>
        photo.id === photoId ? { ...photo, likes: photo.likes + 1 } : photo
      ));
    }
  };

  // Handle bookmark photo
  const handleBookmark = (photoId) => {
    if (bookmarkedPhotos.includes(photoId)) {
      setBookmarkedPhotos(bookmarkedPhotos.filter(id => id !== photoId));
    } else {
      setBookmarkedPhotos([...bookmarkedPhotos, photoId]);
    }
  };

  // Handle download photo
  const handleDownload = (imageUrl, title) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${title.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle share photo
  const handleShare = async (photo) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.title,
          text: photo.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(`${photo.title} - ${photo.description}`);
      alert('Link copied to clipboard!');
    }
  };

  // Open photo in lightbox
  const openLightbox = (photo) => {
    setSelectedPhoto(photo);
    document.body.style.overflow = 'hidden';
  };

  // Close lightbox
  const closeLightbox = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = 'auto';
  };

  // Navigate lightbox
  const navigateLightbox = (direction) => {
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    let newIndex;

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredPhotos.length;
    } else {
      newIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    }

    setSelectedPhoto(filteredPhotos[newIndex]);
  };

  // Handle keyboard navigation in lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedPhoto) return;

      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateLightbox('next');
      if (e.key === 'ArrowLeft') navigateLightbox('prev');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]);

  return (
    <div className={`min-h-screen p-4 md:p-6 ${theme === 'dark'
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
      : 'bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-900'
      }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Camera size={24} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold">Event Gallery</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Showcasing memorable moments from college events
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid'
                    ? theme === 'dark'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-600 text-white'
                    : theme === 'dark'
                      ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } transition-colors`}
                  title="Grid View"
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list'
                    ? theme === 'dark'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-600 text-white'
                    : theme === 'dark'
                      ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } transition-colors`}
                  title="List View"
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className={`p-4 rounded-xl ${theme === 'dark'
              ? 'bg-gray-800/50 border border-gray-700'
              : 'bg-white border border-gray-200'
              }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Photos</p>
                  <p className="text-2xl font-bold mt-1">{photos.length}</p>
                </div>
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <ImageIcon className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl ${theme === 'dark'
              ? 'bg-gray-800/50 border border-gray-700'
              : 'bg-white border border-gray-200'
              }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Featured Events</p>
                  <p className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">
                    {photos.filter(p => p.featured).length}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Star className="text-purple-600 dark:text-purple-400" size={20} />
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl ${theme === 'dark'
              ? 'bg-gray-800/50 border border-gray-700'
              : 'bg-white border border-gray-200'
              }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Likes</p>
                  <p className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">
                    {photos.reduce((sum, photo) => sum + photo.likes, 0)}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <Heart className="text-red-600 dark:text-red-400" size={20} />
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl ${theme === 'dark'
              ? 'bg-gray-800/50 border border-gray-700'
              : 'bg-white border border-gray-200'
              }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Categories</p>
                  <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">4</p>
                </div>
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Tag className="text-green-600 dark:text-green-400" size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={`p-4 rounded-xl mb-6 ${theme === 'dark'
          ? 'bg-gray-800/50 border border-gray-700'
          : 'bg-white border border-gray-200'
          }`}>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search events, descriptions, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {[
                { value: 'all', label: 'All Events', icon: <Grid size={16} /> },
                { value: 'sports', label: 'Sports', icon: <Trophy size={16} /> },
                { value: 'cultural', label: 'Cultural', icon: <Award size={16} /> },
                { value: 'tech', label: 'Tech', icon: <Camera size={16} /> },
                { value: 'workshop', label: 'Workshops', icon: <Users size={16} /> }
              ].map((category) => (
                <button
                  key={category.value}
                  onClick={() => setFilter(category.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${filter === category.value
                    ? theme === 'dark'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-600 text-white'
                    : theme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {category.icon}
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading gallery...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPhotos.length === 0 && (
          <div className={`p-8 rounded-xl text-center ${theme === 'dark'
            ? 'bg-gray-800/50 border border-gray-700'
            : 'bg-white border border-gray-200'
            }`}>
            <Camera className="mx-auto text-gray-400 dark:text-gray-500" size={48} />
            <h3 className="text-xl font-semibold mt-4">No Photos Found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {searchTerm || filter !== 'all'
                ? 'No photos match your search criteria.'
                : 'No photos available at the moment.'}
            </p>
            {(searchTerm || filter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Photo Gallery - Grid View */}
        {!loading && viewMode === 'grid' && filteredPhotos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className={`group relative rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] ${theme === 'dark'
                  ? 'bg-gray-800/50 border border-gray-700 hover:border-gray-600'
                  : 'bg-white border border-gray-200 hover:border-gray-300'
                  } shadow-lg hover:shadow-2xl`}
              >
                {/* Featured Badge */}
                {photo.featured && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">
                      <Star size={10} />
                      Featured
                    </span>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${photo.category === 'sports' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    photo.category === 'cultural' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                      photo.category === 'tech' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                    {photo.category === 'sports' ? <Trophy size={10} /> :
                      photo.category === 'cultural' ? <Award size={10} /> :
                        photo.category === 'tech' ? <Camera size={10} /> :
                          <Users size={10} />}
                    {photo.category.charAt(0).toUpperCase() + photo.category.slice(1)}
                  </span>
                </div>

                {/* Photo */}
                <div
                  className="relative h-64 cursor-pointer overflow-hidden"
                  onClick={() => openLightbox(photo)}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="font-bold text-lg">{photo.title}</h3>
                      <p className="text-sm opacity-90 line-clamp-2">{photo.description}</p>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ZoomIn className="text-white" size={32} />
                  </div>
                </div>

                {/* Photo Info */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{photo.title}</h3>

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(photo.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {photo.venue}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {photo.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded-full text-xs ${theme === 'dark'
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-100 text-gray-600'
                          }`}
                      >
                        #{tag}
                      </span>
                    ))}
                    {photo.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{photo.tags.length - 3}</span>
                    )}
                  </div>

                  {/* Stats and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(photo.id)}
                        className={`flex items-center gap-1 transition-colors ${likedPhotos.includes(photo.id)
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                          }`}
                      >
                        <Heart size={18} fill={likedPhotos.includes(photo.id) ? 'currentColor' : 'none'} />
                        <span className="text-sm">{photo.likes}</span>
                      </button>
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <Eye size={18} />
                        <span className="text-sm">{photo.views}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleBookmark(photo.id)}
                        className={`p-1.5 rounded-lg transition-colors ${bookmarkedPhotos.includes(photo.id)
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        title="Bookmark"
                      >
                        <Bookmark size={18} fill={bookmarkedPhotos.includes(photo.id) ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => handleShare(photo)}
                        className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Share"
                      >
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Photo Gallery - List View */}
        {!loading && viewMode === 'list' && filteredPhotos.length > 0 && (
          <div className="space-y-4">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className={`group rounded-xl overflow-hidden transition-all duration-300 ${theme === 'dark'
                  ? 'bg-gray-800/50 border border-gray-700 hover:border-gray-600'
                  : 'bg-white border border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Photo Thumbnail */}
                  <div
                    className="md:w-64 h-64 md:h-auto cursor-pointer relative overflow-hidden"
                    onClick={() => openLightbox(photo)}
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <ZoomIn className="text-white" size={32} />
                    </div>
                    {photo.featured && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">
                          <Star size={10} />
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Photo Details */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{photo.title}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${photo.category === 'sports' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            photo.category === 'cultural' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                              photo.category === 'tech' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                            }`}>
                            {photo.category.charAt(0).toUpperCase() + photo.category.slice(1)}
                          </span>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-4">{photo.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="text-gray-400" size={16} />
                            <span className="text-sm">
                              {new Date(photo.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="text-gray-400" size={16} />
                            <span className="text-sm">{photo.venue}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Camera className="text-gray-400" size={16} />
                            <span className="text-sm">{photo.photographer}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="text-gray-400" size={16} />
                            <span className="text-sm">{photo.eventType}</span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {photo.tags.map((tag, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 rounded-full text-xs ${theme === 'dark'
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Team Members */}
                        {photo.teamMembers && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Participating Teams:</p>
                            <div className="flex flex-wrap gap-2">
                              {photo.teamMembers.map((team, index) => (
                                <span
                                  key={index}
                                  className={`px-3 py-1 rounded-full text-xs ${theme === 'dark'
                                    ? 'bg-blue-900/30 text-blue-400 border border-blue-800'
                                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                                    }`}
                                >
                                  {team}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleLike(photo.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${likedPhotos.includes(photo.id)
                              ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                          >
                            <Heart size={18} fill={likedPhotos.includes(photo.id) ? 'currentColor' : 'none'} />
                            <span className="font-medium">{photo.likes}</span>
                          </button>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300">
                            <Eye size={18} />
                            <span className="font-medium">{photo.views}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleBookmark(photo.id)}
                            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${bookmarkedPhotos.includes(photo.id)
                              ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                          >
                            <Bookmark size={16} fill={bookmarkedPhotos.includes(photo.id) ? 'currentColor' : 'none'} />
                            Bookmark
                          </button>
                          <button
                            onClick={() => handleDownload(photo.imageUrl, photo.title)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          >
                            <Download size={16} />
                            Download
                          </button>
                          <button
                            onClick={() => handleShare(photo)}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Share2 size={16} />
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
            <div className="relative max-w-7xl w-full max-h-screen">
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X size={24} />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={() => navigateLightbox('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={() => navigateLightbox('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <ChevronRight size={32} />
              </button>

              {/* Photo */}
              <div className="flex flex-col lg:flex-row h-full">
                <div className="lg:w-2/3 flex items-center justify-center p-4">
                  <img
                    src={selectedPhoto.imageUrl}
                    alt={selectedPhoto.title}
                    className="max-h-[70vh] max-w-full object-contain rounded-lg"
                  />
                </div>

                {/* Photo Info */}
                <div className="lg:w-1/3 p-6 overflow-y-auto">
                  <h2 className="text-2xl font-bold text-white mb-4">{selectedPhoto.title}</h2>

                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-300">{selectedPhoto.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Date</p>
                        <p className="text-white">
                          {new Date(selectedPhoto.date).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Venue</p>
                        <p className="text-white">{selectedPhoto.venue}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Event Type</p>
                        <p className="text-white">{selectedPhoto.eventType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Photographer</p>
                        <p className="text-white">{selectedPhoto.photographer}</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedPhoto.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white/10 text-white rounded-full text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => handleLike(selectedPhoto.id)}
                        className="flex items-center gap-2 text-white hover:text-red-400 transition-colors"
                      >
                        <Heart size={20} fill={likedPhotos.includes(selectedPhoto.id) ? 'currentColor' : 'none'} />
                        <span>{selectedPhoto.likes}</span>
                      </button>
                      <div className="flex items-center gap-2 text-white">
                        <Eye size={20} />
                        <span>{selectedPhoto.views}</span>
                      </div>
                      <button
                        onClick={() => handleDownload(selectedPhoto.imageUrl, selectedPhoto.title)}
                        className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
                      >
                        <Download size={20} />
                      </button>
                      <button
                        onClick={() => handleShare(selectedPhoto)}
                        className="flex items-center gap-2 text-white hover:text-green-400 transition-colors"
                      >
                        <Share2 size={20} />
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-white/20">
                      <button
                        onClick={() => handleDownload(selectedPhoto.imageUrl, selectedPhoto.title)}
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Download size={18} />
                        Download Photo
                      </button>
                      <button
                        onClick={() => handleShare(selectedPhoto)}
                        className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Share2 size={18} />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Call to Action */}
        {user && (
          <div className={`mt-8 p-6 rounded-xl ${theme === 'dark'
            ? 'bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700'
            : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'
            }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Have event photos to share?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Upload photos from recent events and contribute to our gallery
                </p>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2">
                <Camera size={20} />
                Upload Photos
              </button>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className={`mt-6 p-4 rounded-xl ${theme === 'dark'
          ? 'bg-gray-800/50 border border-gray-700'
          : 'bg-white border border-gray-200'
          }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Camera className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <div>
                <h5 className="font-medium">High Quality Photos</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  All photos are captured by our professional college photographers
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Users className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <div>
                <h5 className="font-medium">Team Management</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Organized and managed by college student committees
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Calendar className="text-orange-600 dark:text-orange-400" size={20} />
              </div>
              <div>
                <h5 className="font-medium">Regular Updates</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  New event photos added weekly. Stay tuned for updates!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventGallery;
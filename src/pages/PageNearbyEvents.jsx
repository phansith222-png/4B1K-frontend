import React, { useState, useMemo, useEffect, useRef } from 'react';
import Map, { NavigationControl, GeolocateControl, Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import EventMarker from '../components/NearbyEvents/EventMarker';
import EventPopup from '../components/NearbyEvents/EventPopup';
import MapOverlay from '../components/NearbyEvents/MapOverlay';
import { Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllEvents } from '../api/event';
import BackButton from '../components/BackButton';
import { useCyberToast } from '../components/CyberToast';
import { MAPBOX_TOKEN } from '../config/env';
import { useLocation } from 'react-router-dom';


export default function PageNearbyEvents() {
  const mapRef = useRef(null);
  const { showToast } = useCyberToast();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const location = useLocation();

  // Read search query from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [location.search]);

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await getAllEvents();

        // Handle deeply nested response structures
        let eventData = [];
        if (Array.isArray(res)) {
          eventData = res;
        } else if (res?.events && Array.isArray(res.events)) {
          eventData = res.events;
        } else if (res?.data?.events && Array.isArray(res.data.events)) {
          eventData = res.data.events;
        } else if (res?.result?.events && Array.isArray(res.result.events)) {
          eventData = res.result.events;
        } else if (res?.data && Array.isArray(res.data)) {
          eventData = res.data;
        } else if (res?.result && Array.isArray(res.result)) {
          eventData = res.result;
        }

        const FALLBACK_IMAGES = [
          "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1533174000228-4f1b802a433a?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1493225457124-a1a2a5bb001b?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1520095972714-909e91b05382?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop"
        ];

        // Map backend data to frontend format with extreme robustness
        const mappedEvents = eventData.map((event, index) => {
          // Robust Coordinate extraction
          const lat = parseFloat(
            event.venue?.latitude ||
            event.venue?.lat ||
            event.location?.latitude ||
            event.location?.lat ||
            event.latitude ||
            event.lat ||
            event.venue_lat ||
            0
          );
          const lng = parseFloat(
            event.venue?.longitude ||
            event.venue?.lng ||
            event.location?.longitude ||
            event.location?.lng ||
            event.longitude ||
            event.lng ||
            event.venue_lng ||
            0
          );

          // Image URL formatting (Prefer actual poster image from backend)
          const imageUrl = event.posterImage || event.image || event.eventImage || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

          return {
            id: event.id || Math.random(),
            title: event.eventName || event.title || event.name || 'Untitled Event',
            artist: event.mainArtistName || event.artistName || event.artist?.artistName || event.mainArtist?.artistName || "Artist",
            category: event.type || event.category || event.genre || 'All',
            date: event.startTime ? new Date(event.startTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : (event.date || 'Date TBA'),
            time: event.startTime ? `${new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : (event.time || 'Time TBA'),
            location: event.venue?.name || event.location?.name || event.location || 'Location TBA',
            lat: lat,
            lng: lng,
            attendees: event.attendeesCount || event.attendees || event.capacity || 0,
            price: event.price || '฿0',
            ticketUrl: event.ticketUrl || event.ticket_url || 'https://www.thaiticketmajor.com/',
            image: imageUrl,
            hot: event.isHot || event.hot || event.is_hot || false
          };
        }).filter(e => e.lat !== 0 && e.lng !== 0);

        setEvents(mappedEvents);
      } catch (error) {
        console.error("❌ Failed to fetch events for map:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);



  // Animation ตอนโหลดแผนที่เสร็จ
  const onMapLoad = () => {
    const params = new URLSearchParams(location.search);
    const hasSpecialTarget = params.get('search') || params.get('eventId');

    // ถ้าไม่มีการระบุศิลปินหรือกิจกรรมมา ให้บินไปจุดเริ่มต้นปกติ
    if (!hasSpecialTarget) {
      setTimeout(() => {
        mapRef.current?.flyTo({
          center: [100.5528, 13.7405],
          zoom: 13.5,
          pitch: 60,
          bearing: -15,
          duration: 4000,
          essential: true,
          curve: 1.2,
        });
      }, 800);
    }
  };

  // ดึงตำแหน่งปัจจุบันของผู้ใช้
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.warn("Geolocation Blocked/Failed:", error.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, []);

  // Filter events based on active category and search query
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchCategory = activeCategory === 'All' || event.category === activeCategory;
      const matchSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.artist && event.artist.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [events, activeCategory, searchQuery]);

  // Group events by location
  const groupedEvents = useMemo(() => {
    const groups = {};
    filteredEvents.forEach(event => {
      // Use coordinates as key (rounded to prevent floating point issues)
      const key = `${event.lat.toFixed(5)},${event.lng.toFixed(5)}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(event);
    });

    // Sort events in each group by date (newest first)
    return Object.values(groups).map(group => {
      return group.sort((a, b) => {
        const dateA = new Date(a.startTime || a.date);
        const dateB = new Date(b.startTime || b.date);
        return dateB - dateA;
      });
    });
  }, [filteredEvents]);



  const handleMarkerClick = (e, eventGroup) => {
    e.originalEvent.stopPropagation();
    // Show the whole group in the popup
    setSelectedEvent(eventGroup);

    // Zoom to location (offset latitude UPWARDS even more to make room for popup BELOW)
    const event = eventGroup[0];
    mapRef.current?.flyTo({
      center: [event.lng, event.lat - 0.005], // Pushes marker higher on screen
      zoom: 15.5,
      pitch: 45,
      duration: 1800,
      curve: 1.2,
      essential: true
    });
  };




  // 1. ฟังก์ชันปิด Popup และซูมกลับออกมา (Zoom out)
  const handleCloseEvent = () => {
    if (selectedEvent) {
      const event = Array.isArray(selectedEvent) ? selectedEvent[0] : selectedEvent;
      setSelectedEvent(null); // ปิด Popup
      // สั่งให้กล้องซูมถอยกลับออกมา เพื่อให้เห็นภาพรวม
      mapRef.current?.flyTo({
        center: [event.lng, event.lat],
        zoom: 13.5, // ซูมถอยหลังมาที่ระดับ 13.5
        pitch: 60,
        duration: 1500,
        curve: 1.2,
        essential: true
      });
    }
  };
  
  // 🔄 Update Selected Event Popup content when filters change
  useEffect(() => {
    if (selectedEvent) {
      // Use the first event to identify the location
      const location = Array.isArray(selectedEvent) ? selectedEvent[0] : selectedEvent;
      const key = `${location.lat.toFixed(5)},${location.lng.toFixed(5)}`;
      
      // Find if there are still any events at this location that match current filters
      const updatedGroup = groupedEvents.find(group => {
        const first = group[0];
        return `${first.lat.toFixed(5)},${first.lng.toFixed(5)}` === key;
      });

      if (updatedGroup) {
        // Update the popup with matching events at this location
        setSelectedEvent(updatedGroup);
      } else {
        // If no events at this location match anymore, close the popup
        setSelectedEvent(null);
      }
    }
  }, [groupedEvents]); // Dependency on groupedEvents covers category/search changes

  // 3. Handle Auto-select Event from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const eventId = params.get('eventId');
    
    // Ensure map is ready, events are loaded, and we have an eventId to target
    if (mapReady && events.length > 0 && !loading && eventId) {
      const targetGroup = groupedEvents.find(group => 
        group.some(e => String(e.id) === String(eventId))
      );

      if (targetGroup) {
        const timer = setTimeout(() => {
          setSelectedEvent(targetGroup);
          const event = targetGroup[0];
          
          mapRef.current?.flyTo({
            center: [event.lng, event.lat - 0.005],
            zoom: 16,
            pitch: 55,
            bearing: -10,
            duration: 3500,
            curve: 1.2,
            essential: true
          });
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [events.length, loading, location.search, groupedEvents, mapReady]);


  const handleMapClick = () => {
    handleCloseEvent();
  };

  // 2. ฟังก์ชันซูมไปหาผู้ใช้เมื่อกดปุ่ม Custom My Location
  const handleFlyToUser = () => {
    if (userLocation) {
      mapRef.current?.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 14.5,
        pitch: 45,
        bearing: 0,
        duration: 3500, // Longer duration for smoother feel
        essential: true,
        curve: 1.5, // Smoother curve
        speed: 0.6 // Slower speed for more cinematic transition
      });
    } else {
      showToast("Location not found. Please enable location services.", "error");
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-72px)] bg-black text-white overflow-hidden font-sans">
      <BackButton color="#00E5FF" glowColor="rgba(0, 229, 255, 0.3)" />

      {/* 🔄 Loading Bar — thin top bar instead of full-screen overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0 }}
            style={{ originX: 0 }}
            className="absolute top-0 left-0 right-0 z-[100] h-1 bg-gradient-to-r from-[#00E5FF] via-[#7000FF] to-[#00E5FF] animate-pulse"
          />
        )}
      </AnimatePresence>


      {/* 🗺️ MAP CONTAINER (Full Screen) */}
      <div className="absolute inset-0 w-full h-full">
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: 100.5528,
            latitude: 13.7405,
            zoom: 9,
            pitch: 0,
            bearing: 0
          }}
          onLoad={onMapLoad}
          onIdle={() => setMapReady(true)}
          onClick={handleMapClick} // จับ Event คลิกพื้นแผนที่
          onZoom={(e) => {
            // Track zoom boolean to avoid 60fps re-renders during scroll
            const zoomedIn = e.viewState.zoom >= 13.5;
            if (zoomedIn !== isZoomedIn) setIsZoomedIn(zoomedIn);
          }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: '100%', height: '100%' }}
        >
          {/* 🎮 Zoom Controls (Hidden on Mobile, Visible on Desktop) */}
          <div className="hidden md:flex absolute top-32 right-6 flex-col gap-2 z-20 custom-nav-control">
            <NavigationControl showCompass={false} />
          </div>



          {/* 📍 User Current Location Marker (Cyan Theme) */}
          {userLocation && (
            <Marker
              longitude={userLocation.lng}
              latitude={userLocation.lat}
              anchor="center"
            >
              <div className="relative flex items-center justify-center">
                {/* Radar Ping (Classic Map App Style) */}
                <div className="absolute w-10 h-10 bg-[#00E5FF] rounded-full animate-ping opacity-20" />

                {/* White Border + Drop Shadow */}
                <div className="relative w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md z-10">
                  {/* Cyan Core */}
                  <div className="w-3.5 h-3.5 bg-[#00E5FF] rounded-full" />
                </div>
              </div>
            </Marker>
          )}

          {/* Render Markers */}
          {groupedEvents.map((eventGroup, idx) => (
            <EventMarker
              key={eventGroup[0].id || idx}
              event={eventGroup[0]} // Show the newest event
              count={eventGroup.length} // Pass count if needed
              isActive={selectedEvent?.[0]?.lat === eventGroup[0].lat && selectedEvent?.[0]?.lng === eventGroup[0].lng}
              isZoomedIn={isZoomedIn}
              onClick={(e) => handleMarkerClick(e, eventGroup)}
            />
          ))}

          {/* Render Popup */}
          {selectedEvent && (
            <EventPopup
              events={Array.isArray(selectedEvent) ? selectedEvent : [selectedEvent]}
              onClose={handleCloseEvent}
            />
          )}

        </Map>

        {/* 🌘 VIGNETTE OVERLAY (ขอบดำเฟดๆ - ปรับให้จางลงในมือถือตามคำขอ) */}
        <div className="absolute inset-0 pointer-events-none 
          bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.4)_100%)] 
          md:bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.9)_100%)] 
          z-[5]"
        />
        <div className="absolute inset-0 pointer-events-none 
          shadow-[inset_0_0_70px_30px_rgba(0,0,0,0.5)] 
          md:shadow-[inset_0_0_120px_60px_rgba(0,0,0,1)] 
          z-[5]"
        />
      </div>

      {/* 🎛️ OVERLAY UI (Header & Filters) */}
      <MapOverlay
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onFlyToUser={handleFlyToUser}
      />

      {/* สไตล์สำหรับปรับแต่ง Mapbox Popup ให้เข้ากับธีม */}
      <style>{`
        /* Overrides Mapbox Popup Default Styles */
        .mapboxgl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
          border-radius: 1rem !important;
        }
        .mapboxgl-popup-tip {
          border-bottom-color: #1a1d24 !important;
          border-top-color: #1a1d24 !important;
        }
        .mapboxgl-popup-close-button {
          color: white;
          background: rgba(0,0,0,0.5);
          border-radius: 50%;
          width: 24px;
          height: 24px;
          right: 8px;
          top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          z-index: 50;
        }
        .mapboxgl-popup-close-button:hover {
          background: rgba(198,255,0,0.8);
          color: black;
        }

        /* 🎨 Custom Navigation Control Styles */
        .custom-nav-control .mapboxgl-ctrl-group {
          background: rgba(26, 29, 36, 0.8) !important;
          backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5) !important;
          overflow: hidden;
        }
        .custom-nav-control .mapboxgl-ctrl-group button {
          width: 40px !important;
          height: 40px !important;
          color: white !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          transition: all 0.2s !important;
        }
        .custom-nav-control .mapboxgl-ctrl-group button:hover {
          background: #00E5FF !important;
        }
        .custom-nav-control .mapboxgl-ctrl-icon {
          filter: invert(1) brightness(2) !important;
        }
        .custom-nav-control .mapboxgl-ctrl-group button:hover .mapboxgl-ctrl-icon {
          filter: invert(0) !important;
        }

        /* 📱 Hide Zoom Controls on Mobile */
        @media (max-width: 768px) {
          .custom-nav-control {
            display: none !important;
          }
        }

        /* 🚫 Hide scrollbars but keep functionality */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, MapPin } from 'lucide-react';
import EventMarker from '../../NearbyEvents/EventMarker';
import EventPopup from '../../NearbyEvents/EventPopup';
import { getAllEvents } from '../../../api/event';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;


export default function MiniMap({ events: initialEvents = [] }) {
  const mapRef = React.useRef(null);
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(11);
  const [loading, setLoading] = useState(false);

  const events = React.useMemo(() => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return initialEvents.map(event => {
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
      
      // Image URL formatting
      let imageUrl = event.posterImage || event.image || event.poster_image || event.thumbnail;
      if (imageUrl && typeof imageUrl === 'string' && !imageUrl.startsWith('http')) {
        const cleanPath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
        imageUrl = `${API_BASE_URL}/${cleanPath}`;
      }
      if (!imageUrl) {
        imageUrl = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop';
      }

      return {
        id: event.id || Math.random(),
        title: event.eventName || event.title || event.name || 'Untitled Event',
        category: event.type || event.category || event.genre || 'All',
        date: event.startTime ? new Date(event.startTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : (event.date || 'Date TBA'),
        time: event.startTime ? `${new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : (event.time || 'Time TBA'),
        location: event.venue?.name || event.location?.name || event.location || 'Location TBA',
        lat: lat,
        lng: lng,
        attendees: event.attendeesCount || event.attendees || event.capacity || 0,
        price: event.price || '฿0',
        image: imageUrl,
        hot: event.isHot || event.hot || event.is_hot || false
      };
    }).filter(e => e.lat !== 0 && e.lng !== 0);
  }, [initialEvents]);



  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => {}, // ignore errors
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, []);


  // Group events by location
  const groupedEvents = React.useMemo(() => {
    const groups = {};
    events.forEach(event => {
      const key = `${event.lat.toFixed(5)},${event.lng.toFixed(5)}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(event);
    });

    return Object.values(groups).map(group => {
      return group.sort((a, b) => {
        const dateA = new Date(a.startTime || a.date);
        const dateB = new Date(b.startTime || b.date);
        return dateB - dateA;
      });
    });
  }, [events]);

  const zoomTimerRef = React.useRef(null);

  // Throttled move handler to prevent expensive re-renders on every pixel move
  const handleMove = React.useCallback((e) => {
    clearTimeout(zoomTimerRef.current);
    zoomTimerRef.current = setTimeout(() => {
      setZoomLevel(e.viewState.zoom);
    }, 200);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[450px] rounded-3xl overflow-hidden group">
      
      {/* 🔄 Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-8 h-8 border-3 border-[#00E5FF]/20 border-t-[#00E5FF] rounded-full animate-spin mb-2" />
        </div>
      )}

      
      {/* 🌘 Deep Vignette Overlay for Seamless Blending (Fading outside to inside) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(11,12,16,0.3)_40%,_rgba(11,12,16,0.9)_85%,_#0B0C10_100%)] z-[15]" />
      
      {/* 🗺️ Interactive Mini Map */}
      <Map
          ref={mapRef}
          initialViewState={{
            longitude: 100.5528,
            latitude: 13.7405,
            zoom: 11,
            pitch: 45,
            bearing: -15
          }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: '100%', height: '100%' }}
          interactive={true}
          scrollZoom={false} // Disable scroll zoom so it doesn't break page scrolling
          onMove={handleMove}
          onClick={() => setSelectedEvent(null)}
        >
          {/* User Location */}
          {userLocation && (
            <Marker longitude={userLocation.lng} latitude={userLocation.lat} anchor="center">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-10 h-10 bg-[#00E5FF] rounded-full animate-ping opacity-20" />
                <div className="relative w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md z-10">
                  <div className="w-2.5 h-2.5 bg-[#00E5FF] rounded-full" />
                </div>
              </div>
            </Marker>
          )}

          {/* Events from Backend */}
          {groupedEvents.map((eventGroup, idx) => (
            <EventMarker 
              key={eventGroup[0].id || idx} 
              event={eventGroup[0]} // Show newest
              count={eventGroup.length}
              isZoomedIn={false} // Starts as dots, expands on hover
              isActive={selectedEvent?.[0]?.lat === eventGroup[0].lat && selectedEvent?.[0]?.lng === eventGroup[0].lng}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                // Navigate to main map instead of showing popup
                navigate('/nearby-events');
              }}

            />
          ))}


          {/* Render Popup in MiniMap */}
          {selectedEvent && (
            <EventPopup 
              events={Array.isArray(selectedEvent) ? selectedEvent : [selectedEvent]} 
              onClose={() => setSelectedEvent(null)} 
            />
          )}
        </Map>



      {/* 🎮 Compact Vertical Zoom Control (Slider + Buttons) */}
      <div className="absolute bottom-10 right-6 z-20 flex flex-col items-center gap-2 bg-[#1a1c23]/60 backdrop-blur-xl p-2 rounded-full border border-white/10 shadow-2xl">
        <button 
          onClick={() => mapRef.current?.zoomIn()}
          className="w-6 h-6 flex items-center justify-center text-white hover:text-[#00E5FF] transition-colors font-bold text-lg"
        >
          +
        </button>
        
        <div className="h-16 w-4 flex items-center justify-center relative">
          <input 
            type="range" 
            min="9" 
            max="18" 
            step="0.1"
            value={zoomLevel}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setZoomLevel(val);
              mapRef.current?.easeTo({ zoom: val, duration: 100 });
            }}
            className="w-14 -rotate-90 appearance-none bg-white/10 h-1 rounded-full cursor-pointer accent-[#00E5FF] absolute"
            style={{ WebkitAppearance: 'none' }}
          />
        </div>

        <button 
          onClick={() => mapRef.current?.zoomOut()}
          className="w-6 h-6 flex items-center justify-center text-white hover:text-[#00E5FF] transition-colors font-bold text-lg"
        >
          -
        </button>
      </div>

      {/* 🌘 Overlay Gradient (แค่ด้านล่างเพื่อให้ตัวหนังสืออ่านง่าย) */}
      <div className="absolute bottom-0 w-full h-32 pointer-events-none bg-gradient-to-t from-black/80 to-transparent z-[5]" />

      {/* 🚀 Top Right Button (Go to Full Map) */}
      <div className="absolute top-4 right-4 md:right-6 z-20">
        <button 
          onClick={() => navigate('/nearby-events')}
          className="pointer-events-auto bg-[#1a1c23]/80 backdrop-blur-md border border-white/20 text-white hover:text-black hover:bg-[#00E5FF] hover:border-[#00E5FF] px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-all shadow-lg"
        >
          Explore Full Map <ExternalLink size={14} />
        </button>
      </div>

      {/* Title as a Clickable Button */}
      <div 
        onClick={() => navigate('/nearby-events')}
        className="absolute top-4 left-4 md:left-6 z-20 bg-black/40 px-4 py-2 rounded-xl backdrop-blur-md border border-white/5 cursor-pointer hover:bg-[#00E5FF]/20 hover:border-[#00E5FF]/50 hover:scale-105 transition-all group shadow-lg"
      >
        <h3 className="text-white font-black text-sm md:text-base drop-shadow-lg flex items-center gap-2 group-hover:text-[#00E5FF] transition-colors">
          <MapPin className="text-[#00E5FF]" size={16} />
          Nearby Live Events
        </h3>
      </div>

      <style>{`
        .mapboxgl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
          border: none !important;
        }
        .mapboxgl-popup-tip {
          display: none !important;
        }
        
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          background: #00E5FF;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0, 229, 255, 0.6);
          border: 1.5px solid white;
          transition: all 0.2s ease;
        }
        input[type='range']::-webkit-slider-thumb:hover {
          transform: scale(1.3);
          box-shadow: 0 0 15px rgba(0, 229, 255, 0.9);
        }
        input[type='range']::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: #00E5FF;
          border-radius: 50%;
          cursor: pointer;
          border: 1.5px solid white;
        }
      `}</style>


    </div>
  );
}

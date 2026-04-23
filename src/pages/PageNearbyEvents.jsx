import React, { useState, useMemo, useEffect, useRef } from 'react';
import Map, { NavigationControl, GeolocateControl, Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MOCK_EVENTS } from '../components/NearbyEvents/constants';
import EventMarker from '../components/NearbyEvents/EventMarker';
import EventPopup from '../components/NearbyEvents/EventPopup';
import MapOverlay from '../components/NearbyEvents/MapOverlay';
import { Navigation } from 'lucide-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function PageNearbyEvents() {
  const mapRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isZoomedIn, setIsZoomedIn] = useState(false); // Only track boolean to reduce re-renders

  // Animation ตอนโหลดแผนที่เสร็จ
  const onMapLoad = () => {
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
    return MOCK_EVENTS.filter(event => {
      const matchCategory = activeCategory === 'All' || event.category === activeCategory;
      const matchSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleMarkerClick = (e, event) => {
    e.originalEvent.stopPropagation();
    setSelectedEvent(event);
    
    mapRef.current?.flyTo({
      center: [event.lng, event.lat],
      zoom: 15.5,
      pitch: 60,
      duration: 1800,
      curve: 1.2,
      essential: true
    });
  };

  // 1. ฟังก์ชันปิด Popup และซูมกลับออกมา (Zoom out)
  const handleCloseEvent = () => {
    if (selectedEvent) {
      setSelectedEvent(null); // ปิด Popup
      // สั่งให้กล้องซูมถอยกลับออกมา เพื่อให้เห็นภาพรวม
      mapRef.current?.flyTo({
        center: [selectedEvent.lng, selectedEvent.lat],
        zoom: 13.5, // ซูมถอยหลังมาที่ระดับ 13.5
        pitch: 60,
        duration: 1500,
        curve: 1.2,
        essential: true
      });
    }
  };

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
      alert("Location not found. Please enable location services.");
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-72px)] bg-black text-white overflow-hidden font-sans">
      
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
          {/* 🎮 Zoom Controls (Top Right - Theme Colored) */}
          <div className="absolute top-32 right-6 flex flex-col gap-2 z-20 custom-nav-control">
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
          {filteredEvents.map(event => (
            <EventMarker 
              key={event.id} 
              event={event} 
              isActive={selectedEvent?.id === event.id} // ส่งสถานะ Active เข้าไป
              isZoomedIn={isZoomedIn} // ส่ง Boolean ไปแทนเลข Zoom เพื่อลดการ Render
              onClick={(e) => handleMarkerClick(e, event)} 
            />
          ))}

          {/* Render Popup */}
          {selectedEvent && (
            <EventPopup 
              event={selectedEvent} 
              onClose={handleCloseEvent} 
            />
          )}
        </Map>

        {/* 🌘 VIGNETTE OVERLAY (ขอบดำเฟดๆ) */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.9)_100%)] z-[5]" />
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_60px_rgba(0,0,0,1)] z-[5]" />
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

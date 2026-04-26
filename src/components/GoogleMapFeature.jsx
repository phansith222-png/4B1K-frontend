import React, { useCallback, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from "../config/env";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
};

// รับ props: พิกัด (lat, lng) และชื่อสถานที่ (venueName)
function ConcertMap({ lat, lng, venueName }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const [_map, setMap] = useState(null);

  const center = {
    lat: lat || 13.7563, // ถ้าไม่ส่งมาให้ default เป็นกทม.
    lng: lng || 100.5018,
  };

  const onLoad = useCallback(function callback(mapInstance) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  if (!isLoaded)
    return <div className="animate-pulse bg-gray-200 h-[400px] rounded-xl" />;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15} // คอนเสิร์ตต้องการ zoom ที่เห็นซอยหรืออาคารชัดเจน
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker
        position={center}
        title={venueName} // เอาเมาส์วางแล้วขึ้นชื่อสถานที่
      />
    </GoogleMap>
  );
}

export default React.memo(ConcertMap);

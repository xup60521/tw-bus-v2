"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css"

export default function Map() {
  const position = useMemo(
    () => ({ lat: 24.137396608878987, lng: 120.68692065044608 }), // [緯度, 經度]
    []
  );
  return (
    <>
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        className="z-0 h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        <FlyToCurrent />
      </MapContainer>
    </>
  );
}

const FlyToCurrent = () => {
    const map = useMap();
  
    useEffect(() => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          map.flyTo({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
  };
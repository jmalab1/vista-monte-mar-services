import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-providers';
import { FunctionComponent, useEffect, useRef } from 'react';

type TMapboxMap = {
  latLon?: [number, number];
};

const MapboxMap: FunctionComponent<TMapboxMap> = ({ latLon }) => {
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // Reset the map view when the location prop changes
    if (mapRef.current) {
      mapRef.current.setView(latLon, mapRef.current.getZoom());
    }
  }, [location]);

  return (
    <div className="rounded-lg shadow-lg relative mb-5 z-0">
      <MapContainer
        center={latLon}
        zoom={14}
        ref={mapRef}
        style={{ height: '26rem', width: '100%' }}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={latLon}>
          <Popup>Current Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapboxMap;

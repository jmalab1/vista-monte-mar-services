import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-providers';
import { FunctionComponent } from 'react';
//import L from 'leaflet';

type TMapboxMap = {
  latLon?: [number, number];
};

const MapboxMap: FunctionComponent<TMapboxMap> = ({ latLon }) => {
  return (
    <div className="rounded-lg shadow-lg relative mb-5">
      <MapContainer
        center={latLon}
        zoom={14}
        style={{ height: '24rem', width: '100%' }}
      >
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={latLon}>
          <Popup>A pretty popup for your marker.</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapboxMap;

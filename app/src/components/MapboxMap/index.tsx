import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken =
  'pk.eyJ1Ijoiam1hbGFiMjQiLCJhIjoiY20xbjE4aWg4MG95ZDJscHV1ZDE2bWgzbCJ9.A5_cN8-wk6oLWk0Cz0VrXA'; // Replace with your token

const MapboxMap = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current ?? '',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-84.629, 9.6141],
      zoom: 12,
    });

    return () => map.remove();
  }, []);

  return (
    <div ref={mapContainerRef} style={{ height: '24rem', width: '100%' }} />
  );
};

export default MapboxMap;

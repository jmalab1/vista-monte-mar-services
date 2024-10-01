import MapAndTable from '../MapAndTable';
import emergency from './emergency.json';

export const EmergencyDetails = () => {
  return <MapAndTable records={emergency} title="Emergency" />;
};

export default EmergencyDetails;

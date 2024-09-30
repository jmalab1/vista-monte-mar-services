import MapAndTable from '../MapAndTable';

const Emergency = [
  {
    name: 'Jaco Health',
    type: 'Hospital',
    distance: '1.2 miles',
  },
  {
    name: 'Jaco Urgent',
    type: 'Urgent Care',
    distance: '1.8 miles',
  },
  {
    name: 'Jaco Vet',
    type: 'Veterenarian',
    distance: '1.8 miles',
  },
];

export const EmergencyDetails = () => {
  return <MapAndTable records={Emergency} title="Emergency" />;
};

export default EmergencyDetails;

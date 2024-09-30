import MapboxMap from '../../components/MapboxMap';
import SmallTable from '../../components/SmallTable';

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
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-10 mx-12">
      <SmallTable records={Emergency} title="Emergency" />
      <div className="col-span-2">
        <MapboxMap latLon={[9.6056, -84.6164]} />
      </div>
    </div>
  );
};

export default EmergencyDetails;

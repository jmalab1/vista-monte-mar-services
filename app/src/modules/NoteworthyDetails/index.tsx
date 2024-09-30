import MapboxMap from '../../components/MapboxMap';
import SmallTable from '../../components/SmallTable';

const Noteworthy = [
  {
    name: 'Bar',
    type: 'Late Night Activity',
    distance: '1.2 miles',
  },
];

export const NoteworthyDetails = () => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-10 mx-12">
      <SmallTable records={Noteworthy} title="Noteworthy" />
      <div className="col-span-2">
        <MapboxMap latLon={[9.6056, -84.6164]} />
      </div>
    </div>
  );
};

export default NoteworthyDetails;

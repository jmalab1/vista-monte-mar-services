import MapboxMap from '../../components/MapboxMap';
import SmallTable from '../../components/SmallTable';

const ThingsToDo = [
  {
    name: 'Jaco Walk',
    type: 'Shopping',
    distance: '1.2 miles',
  },
  {
    name: 'ATV',
    type: 'Motorsports',
    distance: '1.8 miles',
  },
];

export const ThingsToDoDetails = () => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-10 mx-12">
      <SmallTable records={ThingsToDo} title="Things To Do" />
      <div className="col-span-2">
        <MapboxMap latLon={[9.6056, -84.6164]} />
      </div>
    </div>
  );
};

export default ThingsToDoDetails;

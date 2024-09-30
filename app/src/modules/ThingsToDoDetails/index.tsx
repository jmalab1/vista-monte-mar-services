import MapAndTable from '../MapAndTable';

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
  return <MapAndTable records={ThingsToDo} title="Things To Do" />;
};

export default ThingsToDoDetails;

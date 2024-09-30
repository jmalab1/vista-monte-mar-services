import MapAndTable from '../MapAndTable';

const Noteworthy = [
  {
    name: 'Bar',
    type: 'Late Night Activity',
    distance: '1.2 miles',
  },
];

export const NoteworthyDetails = () => {
  return <MapAndTable records={Noteworthy} title="Noteworthy" />;
};

export default NoteworthyDetails;

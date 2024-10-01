import MapAndTable from '../MapAndTable';
import noteworthy from './noteworthy.json';

export const NoteworthyDetails = () => {
  return <MapAndTable records={noteworthy} title="Noteworthy" />;
};

export default NoteworthyDetails;

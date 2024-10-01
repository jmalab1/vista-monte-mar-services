import MapAndTable from '../MapAndTable';
import thingstodo from './thingstodo.json';

export const ThingsToDoDetails = () => {
  return <MapAndTable records={thingstodo} title="Things To Do" />;
};

export default ThingsToDoDetails;

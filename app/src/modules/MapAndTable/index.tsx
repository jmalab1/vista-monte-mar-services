import { FunctionComponent } from 'react';
import MapboxMap from '../../components/MapboxMap';
import SmallTable, { TSmallTableRecord } from '../../components/SmallTable';

type TMapAndTable = {
  records: TSmallTableRecord[];
  title: string;
};

export const MapAndTable: FunctionComponent<TMapAndTable> = ({
  records,
  title,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 lg:gap-6 mt-10">
      <SmallTable records={records} title={title} />
      <div className="col-span-2">
        <MapboxMap latLon={[9.6056, -84.6164]} />
      </div>
    </div>
  );
};

export default MapAndTable;

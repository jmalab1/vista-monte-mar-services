import { FunctionComponent } from 'react';
import MapboxMap from '../../components/MapboxMap';
import SmallTable, { TSmallTableRecord } from '../../components/SmallTable';
import MiniCardHolder from '../../components/MiniCards/MiniCardHolder';
import MiniCard from '../../components/MiniCards/MiniCard';
import _ from 'lodash';

type TMapAndTable = {
  records: TSmallTableRecord[];
  title: string;
};

export const MapAndTable: FunctionComponent<TMapAndTable> = ({
  records,
  title,
}) => {
  return (
    <div className="md:grid md:grid-cols-1 md:grid-cols-3 md:gap-6 mt-10">
      <MiniCardHolder title={title}>
        {records.map((record) => (
          <MiniCard record={record} />
        ))}
      </MiniCardHolder>
      <div className="col-span-2">
        <MapboxMap latLon={[9.6056, -84.6164]} />
      </div>
    </div>
  );
};

export default MapAndTable;

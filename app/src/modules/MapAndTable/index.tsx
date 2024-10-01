import { FunctionComponent, useState } from 'react';
import MapboxMap from '../../components/MapboxMap';
import { TLatLong, TSmallTableRecord } from '../../components/SmallTable';
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
  const [latitude, setLatitude] = useState(9.6056);
  const [longitude, setLongitude] = useState(-84.6164);

  const onClickMiniCard = (location: TLatLong) => {
    setLatitude(location.latitude);
    setLongitude(location.longitude);
  };

  return (
    <div className="md:grid md:grid-cols-1 md:grid-cols-3 md:gap-6 mt-10">
      <MiniCardHolder title={title}>
        {records.map((record) => (
          <MiniCard record={record} callback={onClickMiniCard} />
        ))}
      </MiniCardHolder>
      <div className="col-span-2">
        <MapboxMap latLon={[latitude, longitude]} />
      </div>
    </div>
  );
};

export default MapAndTable;

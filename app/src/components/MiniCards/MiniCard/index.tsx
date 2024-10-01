import { FunctionComponent } from 'react';
import { TLatLong, TSmallTableRecord } from '../../SmallTable';

type TMiniCard = {
  record: TSmallTableRecord;
  callback: (arg0: TLatLong) => void;
};

const MiniCard: FunctionComponent<TMiniCard> = ({ record, callback }) => {
  return (
    <div
      className="flex items-start rounded-xl bg-base-200 p-2 cursor-pointer hover:bg-base-300 shadow-md"
      onClick={() => callback(record.location)}
    >
      <div className="ml-2">
        <p className="font-semibold text-xs text-nuetral">
          {record.name}{' '}
          <span className="mt-2 content-center">({record.type})</span>
        </p>
        <p className="mt-2 text-xs">{record.description}</p>
        <p className="mt-2 text-xs">Distance: {record.distance}</p>
      </div>
    </div>
  );
};

export default MiniCard;

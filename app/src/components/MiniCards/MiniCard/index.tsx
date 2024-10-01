import { FunctionComponent } from 'react';
import { TLatLong, TSmallTableRecord } from '../../SmallTable';

type TMiniCard = {
  record: TSmallTableRecord;
  callback: (arg0: TLatLong) => void;
};

const MiniCard: FunctionComponent<TMiniCard> = ({ record, callback }) => {
  return (
    <div
      className="flex items-start rounded-xl bg-white p-2 border-solid border-2 cursor-pointer hover:bg-gray-100"
      onClick={() => callback(record.location)}
    >
      <div className="ml-2">
        <p className="font-semibold text-xs">
          {record.name}{' '}
          <span className="mt-2 text-gray-600 content-center">
            ({record.type})
          </span>
        </p>
        <p className="mt-2 text-xs text-gray-600">{record.description}</p>
        <p className="mt-2 text-xs text-gray-600">
          Distance: {record.distance}
        </p>
      </div>
    </div>
  );
};

export default MiniCard;

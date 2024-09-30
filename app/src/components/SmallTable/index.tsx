import { FunctionComponent } from 'react';

type TSmallTableRecord = {
  name: string;
  type: string;
  distance: string;
};

type TSmallTable = {
  records: TSmallTableRecord[];
  title: string;
};

export const SmallTable: FunctionComponent<TSmallTable> = ({
  records,
  title,
}) => {
  return (
    <div className="rounded-xl drop-shadow-2xl max-h-96 bg-white overflow-auto">
      <div className="rounded-t mb-0 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3 className="font-semibold text-base text-blueGray-700">
              {title}
            </h3>
          </div>
        </div>
      </div>
      <div className="block w-full overflow-x-auto">
        <table className="items-center w-full border-collapse text-blueGray-700  ">
          <thead className="thead-light ">
            <tr>
              <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                Name
              </th>
              <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                Type
              </th>
              <th className="px-6 bg-blueGray-50 text-blueGray-700 align-middle border border-solid border-blueGray-100 py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px">
                Distance
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr>
                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                  {record.name}
                </th>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                  {record.type}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                  {record.distance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SmallTable;

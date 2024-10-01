import { FunctionComponent } from 'react';

export type TSmallTableRecord = {
  name: string;
  type: string;
  distance: string;
  description: string;
  location: TLatLong;
};

export type TLatLong = {
  latitude: number;
  longitude: number;
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
    <div className="w-full max-h-96 mb-5 mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
      <header className="px-5 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">{title}</h2>
      </header>
      <div className="p-3">
        <div className="overflow-x-auto max-h-72">
          <table className="table-auto w-full">
            <thead className="text-xs font-semibold uppercase text-gray-600 bg-gray-50">
              <tr>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Name</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Type</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Distance</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {records &&
                records.map((record) => (
                  <tr className="cursor-pointer hover:bg-amber-50">
                    <td className="p-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="font-medium text-gray-800">
                          {record.name}
                        </div>
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-left">{record.type}</div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-left">{record.distance}</div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SmallTable;

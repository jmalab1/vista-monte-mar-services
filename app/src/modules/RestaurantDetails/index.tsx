import MapboxMap from '../../components/MapboxMap';
import SmallTable from '../../components/SmallTable';

const Restaurants = [
  {
    name: 'Takumi',
    type: 'Japanese',
    distance: '1.2 miles',
  },
  {
    name: 'Takumi 1',
    type: 'Japanese',
    distance: '1.8 miles',
  },
  {
    name: 'Takumi 2',
    type: 'Japanese',
    distance: '0.8 miles',
  },
  {
    name: 'Takumi 3',
    type: 'Japanese',
    distance: '3 miles',
  },
  {
    name: 'Takumi 4',
    type: 'Japanese',
    distance: '3 miles',
  },
  {
    name: 'Takumi 5',
    type: 'Japanese',
    distance: '5 miles',
  },
  {
    name: 'Takumi 6',
    type: 'Japanese',
    distance: '5 miles',
  },
  {
    name: 'Takumi 7',
    type: 'Japanese',
    distance: '5 miles',
  },
];

export const RestaurantDetails = () => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-10 mx-12">
      <SmallTable records={Restaurants} title="Restaurants" />
      <div className="col-span-2">
        <MapboxMap latLon={[9.6056, -84.6164]} />
      </div>
    </div>
  );
};

export default RestaurantDetails;

import MapAndTable from '../MapAndTable';

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
  {
    name: 'Takumi 8',
    type: 'Japanese',
    distance: '5 miles',
  },
  {
    name: 'Takumi 9',
    type: 'Japanese',
    distance: '5 miles',
  },
  {
    name: 'Takumi 10',
    type: 'Japanese',
    distance: '5 miles',
  },
];

export const RestaurantDetails = () => {
  return <MapAndTable records={Restaurants} title="Restaurants" />;
};

export default RestaurantDetails;

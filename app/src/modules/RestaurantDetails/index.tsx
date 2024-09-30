import MapAndTable from '../MapAndTable';
import restaurants from './restaurants.json';

export const RestaurantDetails = () => {
  return <MapAndTable records={restaurants} title="Restaurants" />;
};

export default RestaurantDetails;

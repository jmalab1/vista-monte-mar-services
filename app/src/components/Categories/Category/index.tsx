import { Card, CardBody, Typography, Button } from '@material-tailwind/react';
import {
  PencilSquareIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ChartPieIcon,
  LightBulbIcon,
} from '@heroicons/react/24/solid';
import CategoryCard from '../CategoryCard';
import SectionHeader from '../../heading/SectionHeader';
import MapboxMap from '../../MapboxMap';

const CATEGORIES = [
  {
    img: '/image/blogs/blog-3.png',
    icon: ChartPieIcon,
    title: 'Restaurants',
    desc: 'Looking for a bite to eat?',
  },
  {
    img: '/image/blogs/blog-12.jpeg',
    icon: LightBulbIcon,
    title: 'Things To Do',
    desc: 'Explore Jaco',
  },
  {
    img: '/image/blogs/blog-10.jpeg',
    icon: ChatBubbleOvalLeftEllipsisIcon,
    title: 'Emergency',
    desc: 'Need urgent help?',
  },
  {
    img: '/image/blogs/blog-13.png',
    icon: PencilSquareIcon,
    title: 'Noteworthy Places',
    desc: 'Looking for more?',
  },
];

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

export const Category = () => {
  return (
    <section className="px-8 pb-20 pt-20 lg:pt-0 bg-amber-50" id="jaco_beach">
      <div className="mb-10 grid place-items-center text-center ">
        <SectionHeader
          title="Jaco Beach"
          subsection="Jaco is a vibrant coastal destination in Costa Rica, known for its stunning beaches, lively nightlife, and rich biodiversity, below are some ideas to get you pumped."
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mx-12">
        <Card
          color="gray"
          className="relative grid h-full w-full place-items-center overflow-hidden text-center"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
          <CardBody
            className="relative w-full"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <Typography
              variant="h4"
              className="mt-9"
              color="white"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Book With Us
            </Typography>
            <Typography
              color="white"
              className="mt-4 mb-14 font-normal opacity-50"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Enjoy our condo steps from the Pacific coast! Perfect for 4
              guests, it features modern amenities, a pool, and easy access to
              local adventures. Book now for your Costa Rica getaway!
            </Typography>
            <Button
              size="sm"
              color="white"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Read More
            </Button>
          </CardBody>
        </Card>
        <div className="col-span-1 flex flex-col gap-6">
          {CATEGORIES.slice(0, 2).map((props, key) => (
            <CategoryCard key={key} {...props} />
          ))}
        </div>
        <div className="col-span-1 flex flex-col gap-6">
          {CATEGORIES.slice(2, 4).map((props, key) => (
            <CategoryCard key={key} {...props} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-10 mx-12">
        <div className="rounded-xl drop-shadow-2xl max-h-96 bg-white overflow-auto">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base text-blueGray-700">
                  Restaurants
                </h3>
              </div>
            </div>
          </div>
          <div className="block w-full overflow-x-auto">
            <table className="items-center w-full border-collapse text-blueGray-700  ">
              <thead className="thead-light ">
                <tr>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Name
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Type
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-700 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px">
                    Distance
                  </th>
                </tr>
              </thead>
              <tbody>
                {Restaurants.map((props) => (
                  <tr>
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      {props.name}
                    </th>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                      {props.type}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                      {props.distance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-span-2">
          <MapboxMap />
        </div>
      </div>
    </section>
  );
};

export default Category;

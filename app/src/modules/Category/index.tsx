import { Card, CardBody, Typography, Button } from '@material-tailwind/react';
import {
  PencilSquareIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ChartPieIcon,
  LightBulbIcon,
} from '@heroicons/react/24/solid';
import { useState } from 'react';
import RestaurantDetails from '../RestaurantDetails';
import EmergencyDetails from '../EmergencyDetails';
import ThingsToDoDetails from '../ThingsToDoDetails';
import NoteworthyDetails from '../NoteworthyDetails';
import SectionHeader from '../../components/heading/SectionHeader';
import CategoryCard from '../../components/Categories/CategoryCard';

const CATEGORIES = [
  {
    id: 'restaurants',
    img: '/image/blogs/blog-3.png',
    icon: ChartPieIcon,
    title: 'Restaurants',
    desc: 'Looking for a bite to eat?',
  },
  {
    id: 'things_to_do',
    img: '/image/blogs/blog-12.jpeg',
    icon: LightBulbIcon,
    title: 'Things To Do',
    desc: 'Explore Jaco',
  },
  {
    id: 'emergency',
    img: '/image/blogs/blog-10.jpeg',
    icon: ChatBubbleOvalLeftEllipsisIcon,
    title: 'Emergency',
    desc: 'Need urgent help?',
  },
  {
    id: 'noteworthy',
    img: '/image/blogs/blog-13.png',
    icon: PencilSquareIcon,
    title: 'Noteworthy',
    desc: 'Looking for more?',
  },
];

export const Category = () => {
  const [hiddenDivState, setHiddenDivState] = useState('restaurants');

  const cardClickCallbackHandler = (id: string) => {
    setHiddenDivState(id);
  };

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
            <CategoryCard
              key={key}
              {...props}
              callback={cardClickCallbackHandler}
            />
          ))}
        </div>
        <div className="col-span-1 flex flex-col gap-6">
          {CATEGORIES.slice(2, 4).map((props, key) => (
            <CategoryCard
              key={key}
              {...props}
              callback={cardClickCallbackHandler}
            />
          ))}
        </div>
      </div>
      {hiddenDivState == 'restaurants' && <RestaurantDetails />}
      {hiddenDivState == 'emergency' && <EmergencyDetails />}
      {hiddenDivState == 'things_to_do' && <ThingsToDoDetails />}
      {hiddenDivState == 'noteworthy' && <NoteworthyDetails />}
    </section>
  );
};

export default Category;

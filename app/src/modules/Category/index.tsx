import { Card, CardBody } from '@material-tailwind/react';
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
import _ from 'lodash';
import AbbLogo from '../Logos/AbbLogo';
import VrboLogo from '../Logos/VrboLogo';

let categories = [
  {
    id: 'restaurants',
    img: '/image/blogs/blog-3.png',
    icon: ChartPieIcon,
    title: 'Restaurants',
    desc: 'Looking for a bite to eat?',
    active: true,
  },
  {
    id: 'things_to_do',
    img: '/image/blogs/blog-12.jpeg',
    icon: LightBulbIcon,
    title: 'Things To Do',
    desc: 'Explore Jaco',
    active: false,
  },
  {
    id: 'emergency',
    img: '/image/blogs/blog-10.jpeg',
    icon: ChatBubbleOvalLeftEllipsisIcon,
    title: 'Emergency',
    desc: 'Need urgent help?',
    active: false,
  },
  {
    id: 'noteworthy',
    img: '/image/blogs/blog-13.png',
    icon: PencilSquareIcon,
    title: 'Noteworthy',
    desc: 'Looking for more?',
    active: false,
  },
];

export const Category = () => {
  const [hiddenDivState, setHiddenDivState] = useState('restaurants');

  const cardClickCallbackHandler = (id: string) => {
    _.each(categories, (category) => {
      category.active = false;

      if (id == category.id) {
        category.active = true;
      }
    });
    setHiddenDivState(id);
  };

  return (
    <section className="px-8 pb-20 pt-20 lg:pt-0 bg-base-200" id="jaco_beach">
      <div className="mb-10 grid place-items-center text-center ">
        <SectionHeader
          title="Jaco Beach"
          subsection="Jaco is a vibrant coastal destination in Costa Rica, known for its stunning beaches, lively nightlife, and rich biodiversity, below are some ideas to get you pumped."
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card
          className="relative grid h-full w-full place-items-center overflow-hidden text-center bg-nuetral"
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
            <p className="mt-9 text-white text-2xl">Book With Us</p>
            <p className="mt-4 mb-14 font-normal text-white opacity-50">
              Enjoy our condo steps from the Pacific coast! Perfect for 4
              guests, it features modern amenities, a pool, and easy access to
              local adventures. Book now for your Costa Rica getaway!s
            </p>
            <div className="flex gap-6 text-white justify-center">
              <AbbLogo size={40} />
              <VrboLogo size={40} />
            </div>
          </CardBody>
        </Card>
        <div className="col-span-1 flex flex-col gap-6">
          {categories.slice(0, 2).map((props, key) => (
            <CategoryCard
              key={key}
              {...props}
              callback={cardClickCallbackHandler}
            />
          ))}
        </div>
        <div className="col-span-1 flex flex-col gap-6">
          {categories.slice(2, 4).map((props, key) => (
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

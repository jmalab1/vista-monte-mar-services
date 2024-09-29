'use client';

import { Card, CardBody, Typography, Button } from '@material-tailwind/react';
import {
  PencilSquareIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ChartPieIcon,
  LightBulbIcon,
} from '@heroicons/react/24/solid';
import CategoryCard from '../CategoryCard';
import SectionHeader from '../../heading/SectionHeader';

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

export const Category = () => {
  return (
    <section className="mx-auto px-8 pb-20 pt-20 lg:pt-0" id="jaco_beach">
      <div className="mb-10 grid place-items-center text-center">
        <SectionHeader
          title="Jaco Beach"
          subsection="Jaco is a vibrant coastal destination in Costa Rica, known for its stunning beaches, lively nightlife, and rich biodiversity, below are some ideas to get you pumped."
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
              color="white"
              className="text-xs font-bold opacity-50"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              up to 40% OFF
            </Typography>
            <Typography
              variant="h4"
              className="mt-9"
              color="white"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Bestselling Books
            </Typography>
            <Typography
              color="white"
              className="mt-4 mb-14 font-normal opacity-50"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Explore our extensive collection of textbooks, workbooks, novels,
              and more. From preschool to post-grad, we have books for every age
              and academic level.
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
    </section>
  );
};

export default Category;

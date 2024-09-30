import React from 'react';

import { Card, CardBody, Typography } from '@material-tailwind/react';

interface CategoryCardProps {
  id: string;
  img: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  callback: (id: string) => void;
  active: boolean;
}

const CategoryCard = ({
  id,
  img,
  title,
  desc,
  icon: Icon,
  active,
  callback,
}: CategoryCardProps) => {
  return (
    <Card
      className={`relative grid min-h-[12rem] w-full overflow-hidden ${active ? 'grayscale' : 'hover:cursor-pointer transition-transform duration-300 transform hover:scale-105'}`}
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
      onClick={() => callback(id)}
    >
      <img
        src={img}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 h-full w-full bg-black/50" />
      <CardBody
        className="relative flex flex-col justify-between"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <Icon className="h-8 w-8 text-white" />
        <div>
          <Typography
            variant="h5"
            className="mb-1"
            color="white"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {title}
          </Typography>
          <Typography
            color="white"
            className="text-xs font-bold opacity-50"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {desc}
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
};
export default CategoryCard;

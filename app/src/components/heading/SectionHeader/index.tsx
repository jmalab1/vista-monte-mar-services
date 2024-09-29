import { Typography } from '@material-tailwind/react';
import { FunctionComponent } from 'react';

type TSectionHeader = {
  title: string;
  subsection?: string;
};

const SectionHeader: FunctionComponent<TSectionHeader> = ({
  title,
  subsection,
}) => {
  return (
    <>
      <div className="place-items-center text-center">
        <Typography
          variant="h2"
          color="blue-gray"
          className="my-3"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          {title}
        </Typography>
        <Typography
          variant="lead"
          className="!text-gray-500 lg:w-6/12"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          {subsection}
        </Typography>
      </div>
    </>
  );
};

export default SectionHeader;

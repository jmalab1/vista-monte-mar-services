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
        <h1 className="text-secondary text-4xl font-bold mt-10">{title}</h1>
        <Typography
          variant="lead"
          className="!text-nuetral lg:w-6/12"
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

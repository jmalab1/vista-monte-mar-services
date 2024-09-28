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
      <div className="border-b border-gray-900/10 pb-12"></div>
      <h1 className="text-base font-semibold leading-7 text-gray-900">
        {title}
      </h1>
      <p className="mt-1 text-sm leading-6 text-gray-600">{subsection}</p>
    </>
  );
};

export default SectionHeader;

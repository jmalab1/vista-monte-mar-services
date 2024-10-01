import React, { FunctionComponent } from 'react';

type TMiniCardHolder = {
  title: string;
  children?: React.ReactNode;
};

const MiniCardHolder: FunctionComponent<TMiniCardHolder> = ({
  title,
  children,
}) => {
  return (
    <div className="border-solid border-2 border-sky-500 bg-gray-50 p-1 pt-2 rounded-lg mb-5">
      <h4 className="mb-4 text-xl font-bold pl-2">{title}</h4>
      <div className="overflow-auto flex flex-col gap-1 max-h-96">
        {children}
      </div>
    </div>
  );
};

export default MiniCardHolder;

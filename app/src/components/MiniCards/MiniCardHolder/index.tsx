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
    <div className="p-2 pt-4 rounded-lg mb-5 shadow-2xl bg-base-200">
      <h4 className="mb-4 text-lg font-bold pl-2 text-nuetral">{title}</h4>
      <div className="overflow-auto flex flex-col gap-2 max-h-96">
        {children}
      </div>
    </div>
  );
};

export default MiniCardHolder;

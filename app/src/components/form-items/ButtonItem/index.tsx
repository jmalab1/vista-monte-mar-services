import { FunctionComponent } from 'react';

type TButton = {
  title: string;
  classValue: string;
};

const ButtonItem: FunctionComponent<TButton> = ({ title, classValue }) => {
  return (
    <button
      type="button"
      className={`text-sm font-semibold leading-6 ${classValue}`}
    >
      {title}
    </button>
  );
};

export default ButtonItem;

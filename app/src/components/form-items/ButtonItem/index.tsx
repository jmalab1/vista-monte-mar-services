import { FunctionComponent } from 'react';

type TButton = {
  title: string;
  classValue: string;
};

const ButtonItem: FunctionComponent<TButton> = ({ title, classValue }) => {
  return (
    <button type="button" className={`btn btn-sm ${classValue}`}>
      {title}
    </button>
  );
};

export default ButtonItem;

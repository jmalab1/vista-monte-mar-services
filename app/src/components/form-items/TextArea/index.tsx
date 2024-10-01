import { FunctionComponent } from 'react';

type TTextArea = {
  title: string;
  id: string;
  placeholder: string;
};

const TextArea: FunctionComponent<TTextArea> = ({ title, id, placeholder }) => {
  return (
    <label className="form-control col-span-full">
      <div className="label">
        <span className="label-text">{title}</span>
        <span className="label-text-alt"></span>
      </div>
      <textarea
        className="textarea textarea-bordered h-24"
        id={id}
        placeholder={placeholder}
      ></textarea>
      <div className="label">
        <span className="label-text-alt"></span>
        <span className="label-text-alt"></span>
      </div>
    </label>
  );
};

export default TextArea;

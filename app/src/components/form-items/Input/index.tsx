import { FunctionComponent } from 'react';

type TInput = {
  title: string;
  id: string;
  placeholder?: string;
};

const Input: FunctionComponent<TInput> = ({ title, id, placeholder }) => {
  return (
    <label className="form-control sm:col-span-3">
      <div className="label">
        <span className="label-text">{title}</span>
        <span className="label-text-alt"></span>
      </div>
      <input
        type="text"
        id={id}
        placeholder={placeholder}
        className="input input-bordered input-sm"
      />
      <div className="label">
        <span className="label-text-alt"></span>
        <span className="label-text-alt"></span>
      </div>
    </label>
  );
};

export default Input;

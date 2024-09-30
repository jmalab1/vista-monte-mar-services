import { FunctionComponent } from 'react';

type TInput = {
  title: string;
  id: string;
  placeholder?: string;
};

const Input: FunctionComponent<TInput> = ({ title, id, placeholder }) => {
  return (
    <div className="sm:col-span-3">
      <label
        htmlFor="last-name"
        className="block text-sm font-medium leading-6 text-gray-900 text-left"
      >
        {title}
      </label>
      <div className="mt-2">
        <input
          type="text"
          name={id}
          id={id}
          autoComplete="family-name"
          placeholder={placeholder}
          className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
};

export default Input;

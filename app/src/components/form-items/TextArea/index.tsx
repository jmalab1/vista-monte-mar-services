import { FunctionComponent } from 'react';

type TTextArea = {
  title: string;
  id: string;
  placeholder: string;
};

const TextArea: FunctionComponent<TTextArea> = ({ title, id, placeholder }) => {
  return (
    <div className="col-span-full">
      <label
        htmlFor="about"
        className="block text-left text-sm font-medium leading-6 text-gray-900"
      >
        {title}
      </label>
      <div className="mt-2">
        <textarea
          id={id}
          name={id}
          rows={6}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 p-2"
          placeholder={placeholder}
        ></textarea>
      </div>
    </div>
  );
};

export default TextArea;

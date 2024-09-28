import React, { FunctionComponent } from 'react';
import { useState } from 'react';

type TButton = {
  title: string;
  color: string;
};

const Button: FunctionComponent<TButton> = ({ title, color }) => {
  return (
    <button
      type="button"
      className={`text-sm font-semibold leading-6 ${color}`}
    >
      {title}
    </button>
  );
};

export default Button;

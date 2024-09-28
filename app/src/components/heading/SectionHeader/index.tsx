import React from 'react';
import { useState } from 'react';

const SectionHeader = () => {
  return (
    <>
      <div className="border-b border-gray-900/10 pb-12"></div>
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Profile
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        This information will be displayed publicly so be careful what you
        share.
      </p>
    </>
  );
};

export default SectionHeader;

import React from 'react';
import { useState } from 'react';
import Input from '../../form-items/Input';
import TextArea from '../../form-items/TextArea';
import Upload from '../../form-items/Upload';
import SectionHeader from '../../heading/SectionHeader';

const ContactForm = () => {
  return (
    <form>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <SectionHeader />
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <Input />
            <Input />
            <TextArea
              title="Comment"
              id="comment"
              placeholder="Let us know what you think"
            />
            <Upload />
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default ContactForm;

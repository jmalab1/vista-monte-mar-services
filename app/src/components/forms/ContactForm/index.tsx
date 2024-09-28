import React from 'react';
import { useState } from 'react';
import Input from '../../form-items/Input';
import TextArea from '../../form-items/TextArea';
import Upload from '../../form-items/Upload';
import SectionHeader from '../../heading/SectionHeader';
import Button from '../../form-items/Button';

const ContactForm = () => {
  return (
    <form>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <SectionHeader />
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <Input title="First Name" id="firstname" />
            <Input title="Last Name" id="lastname" />
            <TextArea
              title="Comment"
              id="comment"
              placeholder="Let us know what you think"
            />
            <Upload title="Attachments" />
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button title="cancel" color="" />
        <Button title="submit" color="bg-indigo-600" />
      </div>
    </form>
  );
};

export default ContactForm;

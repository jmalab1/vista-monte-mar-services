import ButtonItem from '../../components/form-items/ButtonItem';
import Input from '../../components/form-items/Input';
import TextArea from '../../components/form-items/TextArea';
import Upload from '../../components/form-items/Upload';
import SectionHeader from '../../components/heading/SectionHeader';

const ContactForm = () => {
  return (
    <form className="mx-96 mb-12" id="contact">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <SectionHeader
            title="Contact Us"
            subsection="Tell us about your trip and your stay with us. We'd love to hear from you."
          />
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
        <ButtonItem
          title="cancel"
          classValue="border border-blue-500 text-blue-500 font-bold py-2 px-4 rounded"
        />
        <ButtonItem
          title="submit"
          classValue="bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-bold py-2 px-4 rounded"
        />
      </div>
    </form>
  );
};

export default ContactForm;

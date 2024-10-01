import ButtonItem from '../../components/form-items/ButtonItem';
import Input from '../../components/form-items/Input';
import TextArea from '../../components/form-items/TextArea';
import Upload from '../../components/form-items/Upload';
import SectionHeader from '../../components/heading/SectionHeader';

const ContactForm = () => {
  return (
    <form className="mb-12 lg:mx-72" id="contact">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <SectionHeader
            title="Contact Us"
            subsection="Tell us about your visit. We'd love to hear from you."
          />
          <div className="mr-6 ml-6 mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <Input title="First Name" id="firstname" />
            <Input title="Last Name" id="lastname" />
            <Input title="Email" id="lastname" />
            <Input title="Phone Number" id="lastname" />
            <TextArea
              title="Comment"
              id="comment"
              placeholder="Let us know what you think"
            />
            <Upload title="Attachments" />
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6 mr-4">
        <ButtonItem title="submit" classValue="btn-secondary" />
      </div>
    </form>
  );
};

export default ContactForm;

import Category from './components/Categories/Category';
import ContactForm from './components/forms/ContactForm';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div>
      <Navbar />
      <div className="mx-12">
        <Category />
        <ContactForm />
      </div>
    </div>
  );
};

export default App;

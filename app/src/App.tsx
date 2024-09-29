import Category from './components/Categories/Category';
import ContactForm from './components/forms/ContactForm';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div>
      <Navbar />
      <div>
        <Category />
        <ContactForm />
      </div>
    </div>
  );
};

export default App;

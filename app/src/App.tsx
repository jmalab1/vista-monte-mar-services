import Category from './modules/Category';
import ContactForm from './modules/ContactForm';
import Navbar from './modules/Navbar';

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

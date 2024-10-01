import Category from './modules/Category';
import ContactForm from './modules/ContactForm';
import Footer from './modules/Footer';
import Navbar from './modules/Navbar';

const App = () => {
  return (
    <div>
      <Navbar />
      <div>
        <Category />
        <ContactForm />
      </div>
      <Footer />
    </div>
  );
};

export default App;

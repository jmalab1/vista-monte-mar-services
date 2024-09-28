import './App.css';
import Category from './components/Categories/Category';
import ContactForm from './components/forms/ContactForm';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <>
      <Navbar />
      <Category />
      <ContactForm />
    </>
  );
};

export default App;

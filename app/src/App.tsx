import { useState } from 'react';
import './App.css';
import ContactForm from './components/forms/ContactForm';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <ContactForm />
    </>
  );
};

export default App;

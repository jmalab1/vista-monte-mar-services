import AbbLogo from '../Logos/AbbLogo';
import VrboLogo from '../Logos/VrboLogo';

export const Footer = () => {
  return (
    <footer className="footer bg-base-200 text-base-content items-center p-4">
      <aside className="grid-flow-col items-center">
        <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
      </aside>
      <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <AbbLogo size={24} />
        <VrboLogo size={24} />
      </nav>
    </footer>
  );
};

export default Footer;

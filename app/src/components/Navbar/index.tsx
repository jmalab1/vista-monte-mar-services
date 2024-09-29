import React from 'react';
import {
  Navbar as MTNavbar,
  IconButton,
  Typography,
} from '@material-tailwind/react';
import {
  RectangleStackIcon,
  XMarkIcon,
  Bars3Icon,
  PhotoIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/solid';

const NAV_MENU = [
  {
    name: 'Page',
    icon: RectangleStackIcon,
  },
  {
    name: 'Jaco Beach',
    icon: PhotoIcon,
    href: '#jaco_beach',
  },
  {
    name: 'Contact Us',
    icon: EnvelopeIcon,
    href: '#contact',
  },
];

interface NavItemProps {
  children: React.ReactNode;
  href?: string;
}

function NavItem({ children, href }: NavItemProps) {
  return (
    <li>
      <Typography
        as="a"
        href={href || '#'}
        variant="paragraph"
        color="gray"
        className="flex items-center gap-2 font-medium text-gray-900"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        {children}
      </Typography>
    </li>
  );
}

export const Navbar = () => {
  const [open, setOpen] = React.useState(false);

  function handleOpen() {
    setOpen((cur) => !cur);
  }

  React.useEffect(() => {
    window.addEventListener(
      'resize',
      () => window.innerWidth >= 960 && setOpen(false)
    );
  }, []);

  return (
    <MTNavbar
      shadow={false}
      fullWidth
      className="border-0 sticky top-0 z-50 justify-right"
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <div className="mx-8 flex">
        <div className="w-1/2 justify-items-start">
          <Typography
            color="blue-gray"
            className="text-lg font-bold text-black"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Material Tailwind
          </Typography>
        </div>
        <div className="w-1/2 justify-items-end">
          <ul className="gap-8 lg:flex">
            {NAV_MENU.map(({ name, icon: Icon, href }) => (
              <NavItem key={name} href={href}>
                <Icon className="h-5 w-5" />
                {name}
              </NavItem>
            ))}
          </ul>
        </div>
      </div>
    </MTNavbar>
  );
};

export default Navbar;

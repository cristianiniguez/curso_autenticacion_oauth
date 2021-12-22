import { FC } from 'react';

import AppNavbar from './AppNavbar';
import AppFooter from './AppFooter';

import { generalStyles, visibilityStyles, semanticStyles } from '../utils/globalStyles';
import { User } from '../types';

type LayoutProps = {
  isAuthenticated?: boolean;
  loggedUser?: User;
};

const defaultLoggedUser = { name: 'Guillermo Rodas', email: 'me@guillermorodas.com' };

const Layout: FC<LayoutProps> = ({
  children,
  isAuthenticated = false,
  loggedUser = defaultLoggedUser,
}) => (
  <div className='layout'>
    <AppNavbar loggedUser={loggedUser} />
    <main className='layout-content'>{children}</main>
    <AppFooter />
    <style jsx global>
      {generalStyles}
    </style>
    <style jsx global>
      {visibilityStyles}
    </style>
    <style jsx global>
      {semanticStyles}
    </style>
  </div>
);

export default Layout;

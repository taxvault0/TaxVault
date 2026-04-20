import React, { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { 
  HomeIcon, 
  UserIcon, 
  DocumentIcon, 
  ReceiptPercentIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  BellIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../auth/context/AuthContext';

const Navbar = () => {
  const { user, logout, isCA } = useAuth();
  const navigate = useNavigate();

  const navigation = isCA ? [
    { name: 'Dashboard', href: '/ca/dashboard', icon: HomeIcon },
    { name: 'Clients', href: '/ca/clients', icon: UserIcon },
    { name: 'Reviews', href: '/ca/reviews', icon: DocumentIcon },
    { name: 'Reports', href: '/ca/reports', icon: ChartBarIcon },
  ] : [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Receipts', href: '/receipts', icon: ReceiptPercentIcon },
    { name: 'Mileage', href: '/mileage', icon: ChartBarIcon },
    { name: 'Documents', href: '/documents', icon: DocumentIcon },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to={isCA ? '/ca/dashboard' : '/dashboard'} className="flex items-center">
                <span className="text-2xl font-bold text-primary-500">TaxVault</span>
                <span className="ml-1 text-sm font-medium text-gray-500">CA</span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary-500 border-b-2 border-transparent hover:border-primary-500 transition-colors duration-200"
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-warning-500 ring-2 ring-white"></span>
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-3 focus:outline-none">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-700">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to={isCA ? '/ca/profile' : '/profile'}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } flex items-center px-4 py-2 text-sm text-gray-700`}
                        >
                          <UserIcon className="h-5 w-5 mr-3 text-gray-400" />
                          Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/settings"
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } flex items-center px-4 py-2 text-sm text-gray-700`}
                        >
                          <Cog6ToothIcon className="h-5 w-5 mr-3 text-gray-400" />
                          Settings
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } flex items-center w-full text-left px-4 py-2 text-sm text-gray-700`}
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 text-gray-400" />
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;









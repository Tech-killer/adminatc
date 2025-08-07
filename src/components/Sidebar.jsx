import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/',
      icon: '📊'
    },
    {
      title: 'Content Management',
      items: [
        { title: 'Scroller', path: '/admin/scroller', icon: '📜' },
        { title: 'All imp Links', path: '/admin/hero', icon: '🎯' },
        { title: 'Dignitaries', path: '/admin/photo', icon: '📸' },
        { title: 'Sub-Dignitaries', path: '/admin/feature', icon: '⭐' },
        { title: 'Community', path: '/admin/community', icon: '👥' },
      ]
    }
  ];

  const NavItem = ({ item, isChild = false }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
          isChild ? 'ml-6' : ''
        } ${
          isActive
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
        }`
      }
    >
      <span className="mr-3 text-lg">{item.icon}</span>
      {item.title}
    </NavLink>
  );

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-50">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        <p className="text-sm text-gray-500 mt-1">Content Management</p>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 overflow-y-auto h-full pb-20">
        {menuItems.map((section, index) => (
          <div key={index}>
            {section.path ? (
              /* Single menu item */
              <NavItem item={section} />
            ) : (
              /* Menu section with children */
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </div>
                <div className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <NavItem key={itemIndex} item={item} isChild />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <div className="text-xs text-gray-500 text-center">
          © 2025 Admin Panel
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

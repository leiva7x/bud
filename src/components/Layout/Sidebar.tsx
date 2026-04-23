// src/components/Layout/Sidebar.tsx

import React from 'react';
import {
  Home,
  CreditCard,
  TrendingDown,
  PieChart,
  Settings,
  HelpCircle,
} from 'lucide-react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '#/' },
    { icon: CreditCard, label: 'Transactions', href: '#/transactions' },
    { icon: PieChart, label: 'Budget', href: '#/budget' },
    { icon: TrendingDown, label: 'Debt Planner', href: '#/debt' },
    { icon: Settings, label: 'Settings', href: '#/settings' },
    { icon: HelpCircle, label: 'Help', href: '#/help' },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="nav-item"
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

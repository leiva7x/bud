// src/components/Layout/Header.tsx

import React from 'react';
import { Menu, Bell, Settings, User } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="header">
      <div className="header-left">
        {onMenuClick && (
          <button className="menu-button" onClick={onMenuClick}>
            <Menu size={24} />
          </button>
        )}
        <h1 className="header-title">BUD</h1>
      </div>
      <div className="header-right">
        <button className="icon-button" title="Notifications">
          <Bell size={20} />
        </button>
        <button className="icon-button" title="Settings">
          <Settings size={20} />
        </button>
        <button className="icon-button" title="Profile">
          <User size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;

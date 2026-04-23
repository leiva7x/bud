import React from 'react';
import { Menu, Bell, User, Sun, Moon } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import './Header.css';

interface HeaderProps { onMenuClick: () => void; }

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useSettingsStore();

  return (
    <header className="header">
      <div className="header-left">
        <button onClick={onMenuClick} className="icon-btn"><Menu size={24} /></button>
        <h1 className="logo">BUD <span>Finance</span></h1>
      </div>
      <div className="header-right">
        <button onClick={toggleTheme} className="icon-btn">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button className="icon-btn"><Bell size={20} /></button>
        <div className="user-profile"><User size={20} /></div>
      </div>
    </header>
  );
};

export default Header;

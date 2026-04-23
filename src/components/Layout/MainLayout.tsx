// src/components/Layout/MainLayout.tsx

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from '../Dashboard/Dashboard';
import './MainLayout.css';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="main-layout">
      <Header onMenuClick={toggleSidebar} />
      <div className="main-content">
        {sidebarOpen && <Sidebar />}
        <div className="page-container">
          <div className="content-area">
            <Dashboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;

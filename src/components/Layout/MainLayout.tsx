import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './MainLayout.css';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="main-layout">
      <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
      <div className="layout-body">
        <Sidebar isOpen={isSidebarOpen} />
        <main className={`content ${isSidebarOpen ? 'shifted' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

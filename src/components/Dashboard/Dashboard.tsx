import React from 'react';
import BalanceSummary from './BalanceSummary';
import BudgetProgress from './BudgetProgress';
import RecentTransactions from './RecentTransactions';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Financial Overview</h2>
        <p>Welcome back! Here is what's happening with your money today.</p>
      </header>
      
      <div className="dashboard-grid">
        <section className="summary-section">
          <BalanceSummary />
        </section>
        
        <section className="budget-section">
          <BudgetProgress />
        </section>
        
        <section className="transactions-section">
          <RecentTransactions />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

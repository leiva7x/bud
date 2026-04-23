// src/components/Dashboard/Dashboard.tsx

import React, { useEffect } from 'react';
import { useTransactionStore } from '../../store/transactionStore';
import { useBudgetStore } from '../../store/budgetStore';
import { useDebtStore } from '../../store/debtStore';
import BalanceSummary from './BalanceSummary';
import BudgetProgress from './BudgetProgress';
import RecentTransactions from './RecentTransactions';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { getSummary, getFilteredTransactions } = useTransactionStore();
  const { getCurrentBudget } = useBudgetStore();
  const { getTotalDebt } = useDebtStore();

  const summary = getSummary();
  const transactions = getFilteredTransactions();
  const currentBudget = getCurrentBudget();
  const totalDebt = getTotalDebt();

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard</h2>
      
      <div className="dashboard-grid">
        <BalanceSummary 
          totalIncome={summary.totalIncome}
          totalExpenses={summary.totalExpenses}
          netBalance={summary.netBalance}
          totalDebt={totalDebt}
        />
        
        {currentBudget && (
          <BudgetProgress budget={currentBudget} />
        )}
        
        <RecentTransactions transactions={transactions.slice(0, 5)} />
      </div>
    </div>
  );
};

export default Dashboard;

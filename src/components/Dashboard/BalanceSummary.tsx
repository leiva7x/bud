// src/components/Dashboard/BalanceSummary.tsx

import React from 'react';
import { formatCurrency } from '../../utils/formatting';
import './BalanceSummary.css';

interface BalanceSummaryProps {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  totalDebt: number;
}

const BalanceSummary: React.FC<BalanceSummaryProps> = ({
  totalIncome,
  totalExpenses,
  netBalance,
  totalDebt,
}) => {
  return (
    <div className="balance-summary">
      <h3>Financial Overview</h3>
      
      <div className="summary-grid">
        <div className="summary-card income">
          <p className="label">Total Income</p>
          <p className="amount">{formatCurrency(totalIncome)}</p>
        </div>
        
        <div className="summary-card expenses">
          <p className="label">Total Expenses</p>
          <p className="amount">{formatCurrency(totalExpenses)}</p>
        </div>
        
        <div className="summary-card balance">
          <p className="label">Net Balance</p>
          <p className={`amount ${netBalance >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(netBalance)}
          </p>
        </div>
        
        <div className="summary-card debt">
          <p className="label">Total Debt</p>
          <p className="amount">{formatCurrency(totalDebt)}</p>
        </div>
      </div>
    </div>
  );
};

export default BalanceSummary;

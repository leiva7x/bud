// src/components/Dashboard/BudgetProgress.tsx

import React from 'react';
import { Budget } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatting';
import './BudgetProgress.css';

interface BudgetProgressProps {
  budget: Budget;
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({ budget }) => {
  return (
    <div className="budget-progress">
      <h3>Budget Status</h3>
      
      <div className="budget-info">
        <p className="label">Total Allocated: {formatCurrency(budget.totalAllocated)}</p>
        <p className="label">Total Spent: {formatCurrency(budget.totalSpent)}</p>
        <p className="label">Remaining: {formatCurrency(budget.totalAllocated - budget.totalSpent)}</p>
      </div>
      
      <div className="allocations">
        {budget.allocations.map((allocation) => (
          <div key={allocation.category} className="allocation-item">
            <div className="allocation-header">
              <p className="category">{allocation.category}</p>
              <p className="percentage">{formatPercentage(allocation.percentage)}</p>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(100, (allocation.spent / allocation.allocated) * 100)}%`,
                }}
              />
            </div>
            <p className="spent-info">
              {formatCurrency(allocation.spent)} / {formatCurrency(allocation.allocated)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetProgress;

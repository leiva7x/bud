import React from 'react';
import { useBudgetStore } from '../../store/budgetStore';
import { getBudgetProgress } from '../../utils/calculations';
import './BudgetProgress.css';

const BudgetProgress: React.FC = () => {
  const { budgets } = useBudgetStore();

  return (
    <div className="budget-progress-container">
      <h3>Budget Tracking</h3>
      {budgets.length === 0 ? (
        <p className="empty-state">No budgets set for this month.</p>
      ) : (
        budgets.map(budget => {
          const progress = getBudgetProgress(budget.spent, budget.limit);
          return (
            <div key={budget.id} className="budget-item">
              <div className="budget-info">
                <span>{budget.category}</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default BudgetProgress;

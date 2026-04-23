import React from 'react';
import { useTransactionStore } from '../../store/transactionStore';
import { formatDate, formatCurrency } from '../../utils/formatting';
import './RecentTransactions.css';

const RecentTransactions: React.FC = () => {
  const { transactions } = useTransactionStore();
  
  // Tomamos solo las últimas 5 transacciones
  const recent = transactions.slice(0, 5);

  return (
    <div className="recent-transactions-container">
      <h3>Recent Activity</h3>
      {recent.length === 0 ? (
        <p className="empty-state">No transactions recorded yet.</p>
      ) : (
        <div className="transaction-list">
          {recent.map((t) => (
            <div key={t.id} className="transaction-item">
              <div className="transaction-info">
                <span className="transaction-category">{t.category}</span>
                <span className="transaction-date">{formatDate(t.date)}</span>
              </div>
              <span className={`transaction-amount ${t.type}`}>
                {t.type === 'expense' ? '-' : '+'}{formatCurrency(t.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;

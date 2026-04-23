// src/components/Dashboard/RecentTransactions.tsx

import React from 'react';
import { Transaction } from '../../types';
import { formatCurrency, formatDateShort } from '../../utils/formatting';
import { CATEGORY_ICONS } from '../../utils/constants';
import './RecentTransactions.css';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  return (
    <div className="recent-transactions">
      <h3>Recent Transactions</h3>
      
      {transactions.length === 0 ? (
        <p className="empty-message">No transactions yet</p>
      ) : (
        <ul className="transactions-list">
          {transactions.map((transaction) => (
            <li key={transaction.id} className="transaction-item">
              <div className="transaction-left">
                <span className="icon">
                  {CATEGORY_ICONS[transaction.category] || '📌'}
                </span>
                <div className="transaction-info">
                  <p className="description">{transaction.description}</p>
                  <p className="date">{formatDateShort(transaction.date)}</p>
                </div>
              </div>
              <p className={`amount ${transaction.type === 'income' ? 'income' : 'expense'}`}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentTransactions;

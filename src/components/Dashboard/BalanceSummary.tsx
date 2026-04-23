import React from 'react';
import { TrendingUp, TrendingDown, Wallet, CreditCard } from 'lucide-react';
import { useTransactionStore } from '../../store/transactionStore';
import { formatCurrency } from '../../utils/formatting';
import './BalanceSummary.css';

const BalanceSummary: React.FC = () => {
  const { transactions } = useTransactionStore();

  // Lógica rápida: sumamos ingresos y restamos gastos
  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expenses;

  const cards = [
    { label: 'Total Balance', amount: balance, icon: <Wallet />, color: 'blue' },
    { label: 'Monthly Income', amount: income, icon: <TrendingUp />, color: 'green' },
    { label: 'Monthly Expenses', amount: expenses, icon: <TrendingDown />, color: 'red' },
  ];

  return (
    <div className="balance-grid">
      {cards.map((card, i) => (
        <div key={i} className={`balance-card ${card.color}`}>
          <div className="card-icon">{card.icon}</div>
          <div className="card-info">
            <span className="card-label">{card.label}</span>
            <span className="card-amount">{formatCurrency(card.amount)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BalanceSummary;

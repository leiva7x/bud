// src/App.tsx - Main app component

import React, { useEffect } from 'react';
import './App.css';
import { useTransactionStore } from './store/transactionStore';
import { useBudgetStore } from './store/budgetStore';
import { useDebtStore } from './store/debtStore';
import { useSettingsStore } from './store/settingsStore';
import { offlineDetector } from './services/sync';
import MainLayout from './components/Layout/MainLayout';

const App: React.FC = () => {
  const { loadTransactions } = useTransactionStore();
  const { loadBudgets } = useBudgetStore();
  const { loadDebts } = useDebtStore();
  const { loadSettings } = useSettingsStore();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  useEffect(() => {
    // Initialize app
    const initApp = async () => {
      const userId = 'default-user'; // In real app, would be from auth
      try {
        await loadSettings(userId);
        await loadTransactions();
        await loadBudgets();
        await loadDebts();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initApp();

    // Setup offline detection
    const unsubscribe = offlineDetector.subscribe((online) => {
      setIsOnline(online);
    });

    return unsubscribe;
  }, [loadTransactions, loadBudgets, loadDebts, loadSettings]);

  return (
    <div className="app">
      {!isOnline && (
        <div className="offline-banner">
          <span>📴 You are currently offline. Changes will sync when online.</span>
        </div>
      )}
      <MainLayout />
    </div>
  );
};

export default App;

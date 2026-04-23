import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTransactionStore } from './store/transactionStore';
import { useBudgetStore } from './store/budgetStore';
import { useDebtStore } from './store/debtStore';
import { useSettingsStore } from './store/settingsStore';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';

const App: React.FC = () => {
  // 1. Conectamos con nuestros Stores
  const { loadTransactions } = useTransactionStore();
  const { loadBudgets } = useBudgetStore();
  const { loadDebts } = useDebtStore();
  const { theme } = useSettingsStore();

  // 2. Inicialización: Cargamos los datos de IndexedDB al arrancar
  useEffect(() => {
    const initApp = async () => {
      await Promise.all([
        loadTransactions(),
        loadBudgets(),
        loadDebts()
      ]);
    };
    initApp();
  }, [loadTransactions, loadBudgets, loadDebts]);

  // 3. Aplicamos el tema visual (Claro/Oscuro)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* Aquí agregaremos más rutas en las siguientes etapas */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </MainLayout>
  );
};

export default App;

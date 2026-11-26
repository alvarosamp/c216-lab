import { useEffect, useState } from 'react';
import FinancialSummary from './components/FinancialSummary.jsx';
import TransactionForm from './components/TransactionForm.jsx';
import TransactionList from './components/TransactionList.jsx';
import {
  createTransaction,
  deleteTransaction,
  listTransactions,
  replaceTransaction,
} from './services/transactions.js';

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    listTransactions()
      .then((items) => {
        if (active) setTransactions(items);
      })
      .catch((failure) => {
        if (active) setError(failure.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function save(transaction) {
    setError('');
    setMessage('');
    try {
      const saved = editing
        ? await replaceTransaction(editing.id, transaction)
        : await createTransaction(transaction);
      setTransactions((current) =>
        editing
          ? current.map((item) => (item.id === saved.id ? saved : item))
          : [...current, saved],
      );
      setEditing(null);
      setMessage(editing ? 'Lançamento atualizado.' : 'Lançamento adicionado.');
      return true;
    } catch (failure) {
      setError(failure.message);
      return false;
    }
  }

  async function remove(id) {
    setError('');
    setMessage('');
    try {
      await deleteTransaction(id);
      setTransactions((current) => current.filter((item) => item.id !== id));
      if (editing?.id === id) setEditing(null);
      setMessage('Lançamento excluído.');
    } catch (failure) {
      setError(failure.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-5 py-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">
            Minhas finanças
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Controle Financeiro
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Acompanhe suas receitas, despesas e saldo.
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-6xl space-y-6 px-5 py-8">
        <FinancialSummary transactions={transactions} />
        {loading && <p role="status">Carregando lançamentos...</p>}
        {error && (
          <p role="alert" className="text-sm font-medium text-red-700">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="text-sm font-medium text-teal-800">
            {message}
          </p>
        )}
        <div className="grid items-start gap-6 lg:grid-cols-[360px_1fr]">
          <TransactionForm
            key={editing?.id ?? 'new'}
            transaction={editing}
            onSave={save}
            onCancel={() => setEditing(null)}
          />
          <TransactionList
            transactions={transactions}
            filter={filter}
            onFilterChange={setFilter}
            onEdit={setEditing}
            onDelete={remove}
          />
        </div>
      </main>
      <footer className="mx-auto max-w-6xl px-5 pb-8 text-xs text-slate-500">
        Controle Financeiro · C216 Lab
      </footer>
    </div>
  );
}

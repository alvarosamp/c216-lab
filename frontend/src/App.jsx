import { useState } from 'react';
import FinancialSummary from './components/FinancialSummary.jsx';
import TransactionForm from './components/TransactionForm.jsx';
import TransactionList from './components/TransactionList.jsx';

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');

  function save(transaction) {
    if (editing) {
      setTransactions((current) =>
        current.map((item) =>
          item.id === editing.id ? { ...transaction, id: item.id } : item,
        ),
      );
      setMessage('Lançamento atualizado.');
    } else {
      setTransactions((current) => [
        ...current,
        { ...transaction, id: crypto.randomUUID() },
      ]);
      setMessage('Lançamento adicionado.');
    }
    setEditing(null);
  }

  function remove(id) {
    setTransactions((current) => current.filter((item) => item.id !== id));
    if (editing?.id === id) setEditing(null);
    setMessage('Lançamento excluído.');
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
        <p className="text-sm text-slate-600">
          Os lançamentos ficam nesta sessão e são apagados ao recarregar a
          página.
        </p>
        <p role="status" className="text-sm font-medium text-teal-800">
          {message}
        </p>
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

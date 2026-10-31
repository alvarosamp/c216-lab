import { formatMoney, summarizeTransactions } from '../validation.js';

export default function FinancialSummary({ transactions }) {
  const { income, expense, balance } = summarizeTransactions(transactions);
  return (
    <section
      aria-label="Resumo financeiro"
      className="grid gap-4 sm:grid-cols-3"
    >
      {[
        { title: 'Receitas', value: income, color: 'text-teal-700' },
        { title: 'Despesas', value: expense, color: 'text-rose-700' },
        {
          title: 'Saldo',
          value: balance,
          color: balance < 0 ? 'text-rose-700' : 'text-slate-900',
        },
      ].map(({ title, value, color }) => (
        <article
          key={title}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-sm font-medium text-slate-500">{title}</h2>
          <p className={`mt-3 text-3xl font-semibold tracking-tight ${color}`}>
            {formatMoney(value)}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {title === 'Saldo'
              ? 'Receitas menos despesas'
              : 'Total dos lançamentos'}
          </p>
        </article>
      ))}
    </section>
  );
}

import { formatMoney, toCents } from '../validation.js';

export default function TransactionList({
  transactions,
  filter,
  onFilterChange,
  onEdit,
  onDelete,
}) {
  const visible = transactions.filter(
    (item) => filter === 'all' || item.type === filter,
  );
  return (
    <section
      aria-labelledby="list-title"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="list-title" className="text-xl font-semibold">
            Seus lançamentos
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {visible.length}{' '}
            {visible.length === 1 ? 'lançamento' : 'lançamentos'}
          </p>
        </div>
        <div>
          <label htmlFor="filter" className="sr-only">
            Filtrar por tipo
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(event) => onFilterChange(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="all">Todos os tipos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
        </div>
      </div>
      {visible.length === 0 ? (
        <div className="my-12 rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center">
          <p className="font-medium">Nenhum lançamento por aqui</p>
          <p className="mt-2 text-sm text-slate-500">
            Adicione uma receita ou despesa, ou altere o filtro.
          </p>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-slate-100">
          {visible.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 py-5"
            >
              <div className="min-w-0 flex-1">
                <p className="break-words font-medium">{item.description}</p>
                <p className="mt-1 break-words text-sm text-slate-500">
                  {item.type === 'income' ? 'Receita' : 'Despesa'} ·{' '}
                  {item.category || 'Sem categoria'}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${item.type === 'income' ? 'text-teal-700' : 'text-rose-700'}`}
                >
                  {item.type === 'income' ? '+' : '−'}{' '}
                  {formatMoney(toCents(item.amount))}
                </p>
                <div className="mt-2 flex gap-3 text-sm">
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    aria-label={`Editar ${item.description}`}
                    className="rounded px-1 py-1 text-slate-600 hover:bg-slate-100"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    aria-label={`Excluir ${item.description}`}
                    className="rounded px-1 py-1 text-rose-700 hover:bg-rose-50"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

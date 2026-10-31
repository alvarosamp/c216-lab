import { useState } from 'react';
import { validateTransaction } from '../validation.js';

const emptyForm = {
  description: '',
  amount: '',
  type: 'expense',
  category: '',
};
const inputClass =
  'mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100';

export default function TransactionForm({ transaction, onSave, onCancel }) {
  const [form, setForm] = useState(transaction ?? emptyForm);
  const [errors, setErrors] = useState({});

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = validateTransaction(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSave({
      ...form,
      description: form.description.trim(),
      amount: String(form.amount).trim().replace(',', '.'),
      category: form.category.trim(),
    });
    setForm(emptyForm);
  }

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-labelledby="form-title"
    >
      <h2 id="form-title" className="text-xl font-semibold">
        {transaction ? 'Editar lançamento' : 'Novo lançamento'}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Cadastre uma receita ou despesa.
      </p>
      <form onSubmit={submit} noValidate className="mt-6 space-y-5">
        <div>
          <label htmlFor="description" className="text-sm font-medium">
            Descrição
          </label>
          <input
            id="description"
            name="description"
            value={form.description}
            onChange={update}
            className={inputClass}
            placeholder="Ex.: Conta de internet"
            required
            maxLength={100}
            aria-invalid={!!errors.description}
            aria-describedby={
              errors.description ? 'description-error' : undefined
            }
          />
          {errors.description && (
            <p id="description-error" className="mt-1 text-sm text-red-700">
              {errors.description}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="amount" className="text-sm font-medium">
            Valor (R$)
          </label>
          <input
            id="amount"
            name="amount"
            value={form.amount}
            onChange={update}
            className={inputClass}
            placeholder="0,00"
            inputMode="decimal"
            required
            aria-invalid={!!errors.amount}
            aria-describedby={errors.amount ? 'amount-error' : undefined}
          />
          {errors.amount && (
            <p id="amount-error" className="mt-1 text-sm text-red-700">
              {errors.amount}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="type" className="text-sm font-medium">
            Tipo
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={update}
            className={inputClass}
          >
            <option value="expense">Despesa</option>
            <option value="income">Receita</option>
          </select>
        </div>
        <div>
          <label htmlFor="category" className="text-sm font-medium">
            Categoria{' '}
            <span className="font-normal text-slate-500">(opcional)</span>
          </label>
          <input
            id="category"
            name="category"
            value={form.category}
            onChange={update}
            maxLength={50}
            className={inputClass}
            placeholder="Ex.: Moradia"
            aria-invalid={!!errors.category}
            aria-describedby={errors.category ? 'category-error' : undefined}
          />
          {errors.category && (
            <p id="category-error" className="mt-1 text-sm text-red-700">
              {errors.category}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-teal-700 px-4 py-3 font-semibold text-white hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          {transaction ? 'Salvar alterações' : 'Adicionar lançamento'}
        </button>
        {transaction && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-lg border border-slate-300 p-2 font-medium hover:bg-slate-100"
          >
            Cancelar edição
          </button>
        )}
      </form>
    </section>
  );
}

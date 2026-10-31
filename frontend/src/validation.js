export function validateTransaction(transaction) {
  const errors = {};
  const description = transaction.description.trim();
  if (description.length < 3 || description.length > 100) {
    errors.description = 'Informe uma descrição de 3 a 100 caracteres.';
  }
  const amount = String(transaction.amount).trim().replace(',', '.');
  if (
    !/^\d+(\.\d{1,2})?$/.test(amount) ||
    Number(amount) <= 0 ||
    !Number.isSafeInteger(Math.round(Number(amount) * 100))
  ) {
    errors.amount = 'Informe um valor positivo com até duas casas decimais.';
  }
  if (!['income', 'expense'].includes(transaction.type)) {
    errors.type = 'Selecione receita ou despesa.';
  }
  if (transaction.category.trim().length > 50) {
    errors.category = 'A categoria deve ter até 50 caracteres.';
  }
  return errors;
}

export function toCents(amount) {
  return Math.round(Number(String(amount).replace(',', '.')) * 100);
}

export function summarizeTransactions(transactions) {
  const income = transactions
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + toCents(item.amount), 0);
  const expense = transactions
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + toCents(item.amount), 0);
  return { income, expense, balance: income - expense };
}

export function formatMoney(cents) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}

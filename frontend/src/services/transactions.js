const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function request(path, options) {
  let response;
  try {
    response = await fetch(`${API_URL}/transactions${path}`, options);
  } catch {
    throw new Error(
      'Não foi possível conectar à API. Confira se o servidor está ativo.',
    );
  }
  if (!response.ok) {
    let detail;
    try {
      detail = (await response.json()).detail;
    } catch {
      // Respostas sem JSON ainda precisam exibir uma mensagem útil.
    }
    throw new Error(
      typeof detail === 'string' ? detail : `Erro na API (${response.status}).`,
    );
  }
  return response.status === 204 ? null : response.json();
}

const json = (method, body) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const listTransactions = (type) =>
  request(type ? `?type=${encodeURIComponent(type)}` : '');
export const getTransaction = (id) => request(`/${id}`);
export const createTransaction = (transaction) =>
  request('', json('POST', transaction));
export const replaceTransaction = (id, transaction) =>
  request(`/${id}`, json('PUT', transaction));
export const updateTransaction = (id, fields) =>
  request(`/${id}`, json('PATCH', fields));
export const deleteTransaction = (id) =>
  request(`/${id}`, { method: 'DELETE' });

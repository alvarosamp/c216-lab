import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../src/App.jsx';

let items;
let nextId;
let unavailable = false;
beforeEach(() => {
  items = [];
  nextId = 1;
  unavailable = false;
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url, options = {}) => {
      if (unavailable) throw new Error('offline');
      const method = options.method ?? 'GET';
      const id = Number(url.split('/').at(-1));
      if (method === 'GET')
        return { ok: true, status: 200, json: async () => [...items] };
      if (method === 'POST') {
        const item = { ...JSON.parse(options.body), id: nextId++ };
        items.push(item);
        return { ok: true, status: 201, json: async () => item };
      }
      if (method === 'PUT') {
        const item = { ...JSON.parse(options.body), id };
        items = items.map((old) => (old.id === id ? item : old));
        return { ok: true, status: 200, json: async () => item };
      }
      items = items.filter((item) => item.id !== id);
      return { ok: true, status: 204 };
    }),
  );
});
afterEach(() => vi.unstubAllGlobals());

async function add(user, description, amount, type = 'expense') {
  await user.type(screen.getByLabelText('Descrição'), description);
  await user.type(screen.getByLabelText('Valor (R$)'), amount);
  await user.selectOptions(screen.getByLabelText('Tipo'), type);
  await user.click(
    screen.getByRole('button', { name: 'Adicionar lançamento' }),
  );
}

describe('controle financeiro integrado à API', () => {
  it('carrega, cadastra, filtra, edita e exclui', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('Nenhum lançamento por aqui');
    await add(user, 'Salário', '1000', 'income');
    await screen.findByText('Salário');
    await waitFor(() =>
      expect(screen.getByLabelText('Descrição')).toHaveValue(''),
    );
    await add(user, 'Internet', '120,50');
    await screen.findByText('Internet');
    const summary = screen.getByRole('region', { name: 'Resumo financeiro' });
    expect(summary).toHaveTextContent('879,50');
    await user.selectOptions(
      screen.getByLabelText('Filtrar por tipo'),
      'expense',
    );
    expect(screen.queryByText('Salário')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Editar Internet' }));
    await user.clear(screen.getByLabelText('Valor (R$)'));
    await user.type(screen.getByLabelText('Valor (R$)'), '100');
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }));
    await waitFor(() => expect(summary).toHaveTextContent('900,00'));
    await user.click(screen.getByRole('button', { name: 'Excluir Internet' }));
    await screen.findByText('Nenhum lançamento por aqui');
    expect(within(summary).getAllByText(/1\.000,00/)).toHaveLength(2);
  });
  it('mantém formulário e dados quando a API falha', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('Nenhum lançamento por aqui');
    unavailable = true;
    await add(user, 'Internet', '120');
    await screen.findByRole('alert');
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Não foi possível conectar',
    );
    expect(screen.getByLabelText('Descrição')).toHaveValue('Internet');
    expect(screen.getByText('Nenhum lançamento por aqui')).toBeInTheDocument();
  });
  it('valida antes de enviar', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('Nenhum lançamento por aqui');
    await add(user, 'ab', '-5');
    expect(screen.getByLabelText('Descrição')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

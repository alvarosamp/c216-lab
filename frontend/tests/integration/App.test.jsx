import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../../src/App.jsx';

async function add(user, description, amount, type = 'expense') {
  await user.type(screen.getByLabelText('Descrição'), description);
  await user.type(screen.getByLabelText('Valor (R$)'), amount);
  await user.selectOptions(screen.getByLabelText('Tipo'), type);
  await user.click(
    screen.getByRole('button', { name: 'Adicionar lançamento' }),
  );
}

describe('controle financeiro', () => {
  it('cadastra, filtra, edita e exclui atualizando o saldo total', async () => {
    const user = userEvent.setup();
    render(<App />);
    await add(user, 'Salário', '1000', 'income');
    await add(user, 'Internet', '120,50');
    const summary = screen.getByRole('region', { name: 'Resumo financeiro' });
    expect(summary).toHaveTextContent('879,50');
    await user.selectOptions(
      screen.getByLabelText('Filtrar por tipo'),
      'expense',
    );
    expect(screen.queryByText('Salário')).not.toBeInTheDocument();
    expect(summary).toHaveTextContent('879,50');
    await user.click(screen.getByRole('button', { name: 'Editar Internet' }));
    await user.clear(screen.getByLabelText('Valor (R$)'));
    await user.type(screen.getByLabelText('Valor (R$)'), '100');
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }));
    expect(summary).toHaveTextContent('900,00');
    await user.click(screen.getByRole('button', { name: 'Excluir Internet' }));
    expect(screen.getByText('Nenhum lançamento por aqui')).toBeInTheDocument();
    expect(within(summary).getAllByText(/1\.000,00/)).toHaveLength(2);
  });
  it('exibe erros sem cadastrar dados inválidos', async () => {
    const user = userEvent.setup();
    render(<App />);
    await add(user, 'ab', '-5');
    expect(screen.getByLabelText('Descrição')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(screen.getByLabelText('Valor (R$)')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(screen.getByText('Nenhum lançamento por aqui')).toBeInTheDocument();
  });
  it('cancela uma edição sem alterar o lançamento', async () => {
    const user = userEvent.setup();
    render(<App />);
    await add(user, 'Internet', '120');
    await user.click(screen.getByRole('button', { name: 'Editar Internet' }));
    await user.clear(screen.getByLabelText('Descrição'));
    await user.type(screen.getByLabelText('Descrição'), 'Alterado');
    await user.click(screen.getByRole('button', { name: 'Cancelar edição' }));
    expect(screen.getByText('Internet')).toBeInTheDocument();
    expect(screen.getByLabelText('Descrição')).toHaveValue('');
  });
});

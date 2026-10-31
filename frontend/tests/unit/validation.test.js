import { describe, expect, it } from 'vitest';
import {
  summarizeTransactions,
  toCents,
  validateTransaction,
} from '../../src/validation.js';

const valid = {
  description: 'Internet',
  amount: '120,50',
  type: 'expense',
  category: 'Contas',
};

describe('validação de lançamentos', () => {
  it('aceita vírgula e categoria opcional', () => {
    expect(validateTransaction({ ...valid, category: '' })).toEqual({});
    expect(toCents('120,50')).toBe(12050);
  });
  it.each(['', '0', '-1', 'abc', '1.001', 'Infinity', '1e3'])(
    'rejeita o valor %s',
    (amount) => {
      expect(validateTransaction({ ...valid, amount }).amount).toBeTruthy();
    },
  );
  it('valida descrição, tipo e categoria', () => {
    expect(
      validateTransaction({
        ...valid,
        description: '  a ',
        type: 'other',
        category: 'x'.repeat(51),
      }),
    ).toEqual({
      description: expect.any(String),
      type: expect.any(String),
      category: expect.any(String),
    });
    expect(
      validateTransaction({ ...valid, description: 'x'.repeat(101) })
        .description,
    ).toBeTruthy();
  });
  it('aceita os limites de descrição e categoria', () => {
    expect(
      validateTransaction({
        ...valid,
        description: 'x'.repeat(100),
        category: 'x'.repeat(50),
      }),
    ).toEqual({});
  });
});

describe('resumo financeiro', () => {
  it('inicia zerado', () => {
    expect(summarizeTransactions([])).toEqual({
      income: 0,
      expense: 0,
      balance: 0,
    });
  });
  it('calcula centavos sem acumular erros de ponto flutuante', () => {
    expect(
      summarizeTransactions([
        { type: 'income', amount: '0.10' },
        { type: 'income', amount: '0.20' },
        { type: 'expense', amount: '0.50' },
      ]),
    ).toEqual({ income: 30, expense: 50, balance: -20 });
  });
});

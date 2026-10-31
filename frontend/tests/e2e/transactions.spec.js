import { expect, test } from '@playwright/test';

test('fluxo de receitas e despesas sem persistência', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByLabel('Descrição', { exact: true }).fill('Salário');
  await page.getByLabel('Valor (R$)').fill('2500');
  await page.getByLabel('Tipo', { exact: true }).selectOption('income');
  await page.getByRole('button', { name: 'Adicionar lançamento' }).click();
  await page.getByLabel('Descrição', { exact: true }).fill('Internet');
  await page.getByLabel('Valor (R$)').fill('120,50');
  await page.getByRole('button', { name: 'Adicionar lançamento' }).click();
  const summary = page.getByRole('region', { name: 'Resumo financeiro' });
  await expect(summary).toContainText('2.379,50');
  await page.screenshot({ path: 'test-results/desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.getByRole('button', { name: 'Editar Internet' }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
  await page.getByLabel('Filtrar por tipo').selectOption('expense');
  await expect(page.getByText('Salário', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Editar Internet' }).click();
  await page.getByLabel('Valor (R$)').fill('100');
  await page.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(summary).toContainText('2.400,00');
  await page.getByRole('button', { name: 'Excluir Internet' }).click();
  await expect(page.getByText('Nenhum lançamento por aqui')).toBeVisible();
  await page.reload();
  await expect(summary).not.toContainText('2.500,00');
  await expect(page.getByText('Nenhum lançamento por aqui')).toBeVisible();
  expect(errors).toEqual([]);
});

test('valida dados antes de adicionar', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Adicionar lançamento' }).click();
  await expect(
    page.getByText('Informe uma descrição de 3 a 100 caracteres.'),
  ).toBeVisible();
  await expect(
    page.getByText('Informe um valor positivo com até duas casas decimais.'),
  ).toBeVisible();
  await expect(page.getByText('Nenhum lançamento por aqui')).toBeVisible();
});

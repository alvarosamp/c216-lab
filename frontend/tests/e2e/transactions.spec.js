import { expect, test } from '@playwright/test';

test.afterEach(async ({ request }) => {
  const response = await request.get('http://127.0.0.1:8000/transactions');
  for (const item of await response.json()) {
    if (item.description.startsWith('E2E '))
      await request.delete(`http://127.0.0.1:8000/transactions/${item.id}`);
  }
});

test('cadastra, persiste, edita e exclui lançamentos', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Carregando lançamentos...')).toHaveCount(0);
  await page.getByLabel('Descrição', { exact: true }).fill('E2E Salário');
  await page.getByLabel('Valor (R$)').fill('2500');
  await page.getByLabel('Tipo', { exact: true }).selectOption('income');
  await page.getByRole('button', { name: 'Adicionar lançamento' }).click();
  await expect(page.getByText('E2E Salário', { exact: true })).toBeVisible();
  await page.getByLabel('Descrição', { exact: true }).fill('E2E Internet');
  await page.getByLabel('Valor (R$)').fill('120,50');
  await page.getByRole('button', { name: 'Adicionar lançamento' }).click();
  const summary = page.getByRole('region', { name: 'Resumo financeiro' });
  await expect(summary).toContainText('2.379,50');
  await page.reload();
  await expect(page.getByText('E2E Internet', { exact: true })).toBeVisible();
  await expect(summary).toContainText('2.379,50');
  await page.getByLabel('Filtrar por tipo').selectOption('expense');
  await expect(page.getByText('E2E Salário', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Editar E2E Internet' }).click();
  await page.getByLabel('Valor (R$)').fill('100');
  await page.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(summary).toContainText('2.400,00');
  await page.getByRole('button', { name: 'Excluir E2E Internet' }).click();
  await expect(page.getByText('E2E Internet', { exact: true })).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test('valida dados antes de enviar', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Adicionar lançamento' }).click();
  await expect(
    page.getByText('Informe uma descrição de 3 a 100 caracteres.'),
  ).toBeVisible();
  await expect(
    page.getByText('Informe um valor positivo com até duas casas decimais.'),
  ).toBeVisible();
});

import { expect, test } from '@playwright/test'

test('cadastra, simula e confirma persistência após recarregar', async ({
  page,
}) => {
  const suffix = Date.now().toString().slice(-8)
  await page.goto('/')
  await page.getByRole('button', { name: 'Séries de preços' }).click()
  await page.getByLabel('Nome', { exact: true }).fill(`Série E2E ${suffix}`)
  await page.getByLabel('Símbolo').fill(`E2E${suffix}`)
  await page.getByRole('button', { name: 'Cadastrar série' }).click()
  await expect(page.getByText('Série cadastrada.')).toBeVisible()
  await page.getByLabel('Data', { exact: true }).fill('2026-01-05')
  await page.getByLabel('Preço de fechamento').fill('100')
  await page.getByRole('button', { name: 'Adicionar cotação' }).click()
  await page.getByLabel('Data', { exact: true }).fill('2026-02-05')
  await page.getByLabel('Preço de fechamento').fill('120')
  await page.getByRole('button', { name: 'Adicionar cotação' }).click()

  await page.getByRole('button', { name: 'Estratégias', exact: true }).click()
  await page.getByLabel('Nome', { exact: true }).fill(`Aporte E2E ${suffix}`)
  await page.getByLabel('Modalidade').selectOption('monthly_dca')
  await page.getByLabel('Capital inicial (R$)').fill('1000')
  await page.getByLabel('Aporte mensal (R$)').fill('200')
  await page.getByRole('button', { name: 'Cadastrar estratégia' }).click()

  await page.getByRole('button', { name: 'Nova simulação' }).click()
  await page
    .getByLabel('Série', { exact: true })
    .selectOption({ label: `E2E${suffix} — Série E2E ${suffix} (2 cotações)` })
  await page
    .getByLabel('Estratégia', { exact: true })
    .selectOption({ label: `Aporte E2E ${suffix}` })
  await page.getByLabel('Data inicial').fill('2026-01-05')
  await page.getByLabel('Data final').fill('2026-02-05')
  await page.getByRole('button', { name: /Executar simulação/ }).click()
  await expect(page.getByText('Simulação calculada e salva.')).toBeVisible()
  await expect(page.getByText(/1\.400,00/).first()).toBeVisible()
  await page.reload()
  await expect(page.getByText(`Aporte E2E ${suffix}`)).toBeVisible()
  await expect(page.getByText(/1\.400,00/).first()).toBeVisible()
})

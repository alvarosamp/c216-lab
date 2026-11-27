import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import App from '../src/App'

afterEach(() => vi.unstubAllGlobals())

it('mostra dados recebidos da API no painel', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url) => ({
      ok: true,
      json: async () =>
        url.endsWith('/series')
          ? [
              {
                id: 1,
                name: 'Exemplo',
                symbol: 'EX',
                description: '',
                points: [],
              },
            ]
          : [],
    })),
  )
  render(<App />)
  await waitFor(() =>
    expect(
      screen.getByText('1', { selector: '.stat strong' }),
    ).toBeInTheDocument(),
  )
  expect(screen.getByText('Séries cadastradas')).toBeInTheDocument()
})

it('exibe falha de conexão com instrução clara', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => {
      throw new Error('offline')
    }),
  )
  render(<App />)
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Não foi possível acessar a API',
  )
})

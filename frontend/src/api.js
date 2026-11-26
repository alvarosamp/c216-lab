const base = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${base}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    })
  } catch {
    throw new Error(
      'Não foi possível acessar a API. Confira se os serviços estão ligados.',
    )
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const detail = body.detail
    throw new Error(
      typeof detail === 'string'
        ? detail
        : 'Confira os dados e tente novamente.',
    )
  }
  return response.status === 204 ? null : response.json()
}

export const catalog = {
  series: () => request('/series'),
  strategies: () => request('/strategies'),
  simulations: () => request('/simulations'),
  saveSeries: (data, id) =>
    request(id ? `/series/${id}` : '/series', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(data),
    }),
  deleteSeries: (id) => request(`/series/${id}`, { method: 'DELETE' }),
  addPoint: (id, data) =>
    request(`/series/${id}/points`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deletePoint: (id) => request(`/points/${id}`, { method: 'DELETE' }),
  saveStrategy: (data, id) =>
    request(id ? `/strategies/${id}` : '/strategies', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(data),
    }),
  deleteStrategy: (id) => request(`/strategies/${id}`, { method: 'DELETE' }),
  simulate: (data) =>
    request('/simulations', { method: 'POST', body: JSON.stringify(data) }),
  deleteSimulation: (id) => request(`/simulations/${id}`, { method: 'DELETE' }),
}

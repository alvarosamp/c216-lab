export const money = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    Number(value),
  )

export const percent = (value) =>
  `${Number(value).toFixed(2).replace('.', ',')}%`

export const dateBR = (value) => value?.split('-').reverse().join('/') || '—'

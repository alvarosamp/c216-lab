import { describe, expect, it } from 'vitest'
import { money, percent } from '../src/format'

describe('formatação de resultados', () => {
  it('mostra valores monetários e percentuais em português', () => {
    expect(money(1200)).toContain('1.200,00')
    expect(percent('12.3456')).toBe('12,35%')
  })
})

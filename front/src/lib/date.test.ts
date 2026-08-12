import { describe, expect, it } from 'vitest'
import { formatDisplayDate, toDateOnly } from './date'

describe('toDateOnly', () => {
  it('extrai a data de um timestamp ISO completo', () => {
    expect(toDateOnly('2026-08-11T22:06:48.822Z')).toBe('2026-08-11')
  })
})

describe('formatDisplayDate', () => {
  it('formata uma data YYYY-MM-DD para "dia MÊS"', () => {
    expect(formatDisplayDate('2026-08-11')).toBe('11 AGO')
  })

  it('devolve a string original se não conseguir interpretar a data', () => {
    expect(formatDisplayDate('data-invalida')).toBe('data-invalida')
  })
})

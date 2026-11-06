export function exportCSV(filename, columns, rows) {
  const esc = (v) => {
    const s = String(v ?? '')
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const header = columns.map((c) => esc(c.label)).join(',')
  const body = rows.map((r) => columns.map((c) => esc(c.value ? c.value(r) : r[c.key])).join(',')).join('\n')
  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 500)
}

export function matchesSearch(row, q, keys) {
  if (!q) return true
  const s = q.trim().toLowerCase()
  return keys.some((k) => String(row[k] ?? '').toLowerCase().includes(s))
}

export function downloadReceipt(row, lines) {
  const text = [
    'RODIALL PAYMENT RECEIPT',
    '==========================',
    ...lines.map(([k, v]) => `${k.padEnd(20, ' ')}${v}`),
    '',
    'Thank you for choosing Rodiall.',
  ].join('\n')
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `receipt-${row.ref || row.id}.txt`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 500)
}

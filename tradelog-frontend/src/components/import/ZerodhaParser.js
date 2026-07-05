// ZerodhaParser.js
export function parseZerodha(csvText) {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  return lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/"/g, ''))
    const row = {}
    headers.forEach((h, i) => { row[h] = vals[i] })
    return {
      symbol: row['symbol'] || row['Symbol'] || '',
      tradeDate: row['trade_date'] || row['Date'] || '',
      segment: detectSegment(row['exchange'] || ''),
      side: (row['trade_type'] || '').toUpperCase() === 'BUY' ? 'LONG' : 'SHORT',
      entryPrice: parseFloat(row['price'] || 0),
      quantity: parseFloat(row['quantity'] || 0),
    }
  }).filter(r => r.symbol)
}

function detectSegment(exchange) {
  if (exchange.includes('NFO') || exchange.includes('BFO')) return 'FO_OPTIONS'
  if (exchange.includes('MCX')) return 'FO_FUTURES'
  return 'EQUITY'
}

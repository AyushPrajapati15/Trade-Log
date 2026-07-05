// AngelParser.js
export function parseAngel(csvText) {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  return lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/"/g, ''))
    const row = {}
    headers.forEach((h, i) => { row[h] = vals[i] })
    return {
      symbol: row['Symbol'] || row['Scrip'] || '',
      tradeDate: row['Order Date'] || row['Date'] || '',
      segment: 'EQUITY',
      side: row['Tr. Type'] === 'buy' ? 'LONG' : 'SHORT',
      entryPrice: parseFloat(row['Avg. Price'] || 0),
      quantity: parseFloat(row['Qty.'] || row['Quantity'] || 0),
    }
  }).filter(r => r.symbol)
}

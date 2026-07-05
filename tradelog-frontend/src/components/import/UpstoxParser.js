// UpstoxParser.js
export function parseUpstox(csvText) {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  return lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/"/g, ''))
    const row = {}
    headers.forEach((h, i) => { row[h] = vals[i] })
    return {
      symbol: row['Scrip Name'] || row['symbol'] || '',
      tradeDate: row['Date'] || row['trade_date'] || '',
      segment: row['Segment']?.includes('OPT') ? 'FO_OPTIONS' : row['Segment']?.includes('FUT') ? 'FO_FUTURES' : 'EQUITY',
      side: row['Buy/Sell'] === 'B' ? 'LONG' : 'SHORT',
      entryPrice: parseFloat(row['Buy Avg Price'] || row['Price'] || 0),
      exitPrice: parseFloat(row['Sell Avg Price'] || 0),
      quantity: parseFloat(row['Qty'] || 0),
      netPnl: parseFloat(row['Net P&L'] || 0),
    }
  }).filter(r => r.symbol)
}

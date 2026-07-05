const TICKERS = [
  { sym: 'NIFTY 50', val: '22,450.30', chg: '+0.82%', pos: true },
  { sym: 'BANK NIFTY', val: '47,820.15', chg: '+1.14%', pos: true },
  { sym: 'SENSEX', val: '73,890.40', chg: '+0.76%', pos: true },
  { sym: 'RELIANCE', val: '2,894.50', chg: '-0.31%', pos: false },
  { sym: 'TCS', val: '3,756.80', chg: '+0.54%', pos: true },
  { sym: 'HDFC BANK', val: '1,648.25', chg: '-0.22%', pos: false },
  { sym: 'INFOSYS', val: '1,729.60', chg: '+0.68%', pos: true },
  { sym: 'WIPRO', val: '462.40', chg: '+1.02%', pos: true },
  { sym: 'ICICI BANK', val: '1,092.15', chg: '+0.45%', pos: true },
  { sym: 'SBI', val: '784.30', chg: '-0.18%', pos: false },
]

const Item = ({ sym, val, chg, pos }) => (
  <div className="flex items-center gap-2 px-5 flex-shrink-0">
    <span className="text-xs font-semibold text-textMid">{sym}</span>
    <span className="font-mono text-xs text-white">{val}</span>
    <span className={`font-mono text-xs font-bold ${pos ? 'text-accent' : 'text-red'}`}>{chg}</span>
    <div className="w-px h-3 bg-border ml-1" />
  </div>
)

export default function TickerTape() {
  const doubled = [...TICKERS, ...TICKERS]
  return (
    <div className="bg-surface border-b border-border h-8 overflow-hidden flex items-center">
      <div className="ticker-inner flex items-center whitespace-nowrap">
        {doubled.map((t, i) => <Item key={i} {...t} />)}
      </div>
    </div>
  )
}

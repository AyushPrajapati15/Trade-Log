import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const val = payload[0].value
  return (
    <div className="custom-tooltip">
      <div className="text-textMid text-[10px] mb-0.5">{label}</div>
      <div className={val >= 0 ? 'text-accent font-bold' : 'text-red font-bold'}>
        {val >= 0 ? '+' : ''}₹{Math.abs(val).toLocaleString('en-IN')}
      </div>
    </div>
  )
}

export default function MonthlyBar({ data = [] }) {
  if (!data.length) return (
    <div className="h-[140px] flex items-center justify-center text-textMid text-sm">No monthly data</div>
  )

  const formatted = data.map(d => ({
    month: (d.month || '').slice(0, 7),
    netPnl: d.netPnl,
    trades: d.trades,
    winRate: d.winRate,
  }))

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={formatted} margin={{ top: 4, right: 4, left: 4, bottom: 0 }} barSize={28}>
        <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#7A8FB5', fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="netPnl" radius={[3, 3, 0, 0]}>
          {formatted.map((d, i) => (
            <Cell key={i} fill={d.netPnl >= 0 ? '#05E8B4' : '#FF3D6B'} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

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

export default function EquityCurve({ data = [] }) {
  if (!data.length) {
    return (
      <div className="h-[120px] flex items-center justify-center text-textMid text-sm">
        No trade data yet
      </div>
    )
  }

  const isPositive = data[data.length - 1]?.cumPnl >= 0

  return (
    <ResponsiveContainer width="100%" height={120}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
        <defs>
          <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={isPositive ? '#05E8B4' : '#FF3D6B'} stopOpacity={0.2} />
            <stop offset="95%" stopColor={isPositive ? '#05E8B4' : '#FF3D6B'} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" hide />
        <YAxis hide />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="cumPnl"
          stroke={isPositive ? '#05E8B4' : '#FF3D6B'}
          strokeWidth={2}
          fill="url(#eqGrad)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

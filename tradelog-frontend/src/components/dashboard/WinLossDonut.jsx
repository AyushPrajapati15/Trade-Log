import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export default function WinLossDonut({ wins = 0, losses = 0 }) {
  const total = wins + losses
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0'
  const data = [
    { name: 'Wins', value: wins },
    { name: 'Losses', value: losses || (wins === 0 ? 1 : 0) },
  ]

  return (
    <div className="relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height={140}>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={44} outerRadius={60}
            startAngle={90} endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            <Cell fill="#05E8B4" />
            <Cell fill="#FF3D6B22" />
          </Pie>
          <Tooltip
            formatter={(v, n) => [`${v}`, n]}
            contentStyle={{ background: '#0E1420', border: '1px solid #1C2840', borderRadius: 8, fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="font-mono font-bold text-xl text-white">{winRate}%</div>
        <div className="text-[10px] text-textMid">win rate</div>
      </div>
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-4">
        <div className="flex items-center gap-1.5 text-[10px] text-textMid">
          <div className="w-2 h-2 rounded-full bg-accent" />
          Wins {wins}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-textMid">
          <div className="w-2 h-2 rounded-full bg-red/40" />
          Loss {losses}
        </div>
      </div>
    </div>
  )
}

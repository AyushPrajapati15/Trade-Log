export default function StatCard({ label, value, sub, color = '#05E8B4', icon }) {
  return (
    <div className="stat-card animate-fade-up" style={{ '--stat-color': color }}>
      <div className="pl-3">
        <div className="section-label mb-1.5 flex items-center gap-1.5">
          {icon && <span>{icon}</span>}
          {label}
        </div>
        <div className="font-mono text-xl font-bold tracking-tight">{value}</div>
        {sub && <div className="text-[11px] text-textMid mt-1">{sub}</div>}
      </div>
    </div>
  )
}

export default function ImportPreview({ rows = [] }) {
  if (!rows.length) return null
  return (
    <div className="mt-4">
      <div className="section-label mb-2">Preview ({rows.length} rows)</div>
      <div className="overflow-x-auto max-h-48 border border-border rounded-lg">
        <table className="data-table text-[11px]">
          <thead>
            <tr>
              {Object.keys(rows[0]).map(k => <th key={k}>{k}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 10).map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((v, j) => (
                  <td key={j} className="whitespace-nowrap">{String(v)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function MistakeTags({ tags = [] }) {
  if (!tags.length) return <span className="text-textMid text-xs italic">None</span>
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map(tag => (
        <span key={tag} className="badge-amber text-[10px] px-1.5 py-0.5">{tag}</span>
      ))}
    </div>
  )
}

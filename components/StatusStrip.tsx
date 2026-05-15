// components/StatusStrip.tsx
type Stat = { label: string; value: string; sub?: string }

export default function StatusStrip({ stats }: { stats: Stat[] }) {
  return (
    <div className="max-w-wrap mx-auto px-6 md:px-12">
      <div className="border-y border-rule grid grid-cols-2 md:grid-cols-4 bg-paper">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`p-6 md:p-7 ${i < stats.length - 1 ? 'md:border-r border-rule' : ''} ${i % 2 === 0 ? 'border-r md:border-r' : ''} ${i < 2 ? 'border-b md:border-b-0' : ''} border-rule`}
          >
            <div className="kicker mb-2.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              {s.label}
            </div>
            <div className="serif font-normal text-3xl tracking-tight text-ink">
              {s.value}
              {s.sub && <span className="mono text-[11px] text-mute ml-2 align-baseline">{s.sub}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

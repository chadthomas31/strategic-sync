// components/FieldNote.tsx
import { ReactNode } from 'react'

export default function FieldNote({ label, children }: { label: string; children: ReactNode }) {
  return (
    <aside className="border-l border-rule pl-6 py-2">
      <div className="kicker mb-3">{label}</div>
      <div className="body-s">{children}</div>
    </aside>
  )
}

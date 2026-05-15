// pages/api/og.tsx
import { ImageResponse } from '@vercel/og'
import type { NextRequest } from 'next/server'

export const config = { runtime: 'edge' }

export default function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? 'Strategic Sync'
  const kicker = searchParams.get('kicker') ?? 'AI Automation & Integration'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background: '#f5f1e8',
          color: '#15140f',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '18px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7a7066' }}>
          <div style={{ width: '8px', height: '8px', background: '#f04e23' }} />
          {kicker}
        </div>
        <div style={{ fontSize: '88px', fontWeight: 300, lineHeight: 0.96, letterSpacing: '-0.025em', maxWidth: '900px' }}>
          {title}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '20px', color: '#3a3530' }}>
          <span style={{ fontWeight: 500 }}>strategicsync.com</span>
          <span style={{ fontFamily: 'monospace', letterSpacing: '0.16em', fontSize: '16px' }}>SS · 949.998.2424</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}

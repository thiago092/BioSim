import type { Phase, ModeLevel } from '../types'
import { getPhasesForMode, getDescriptionForPhase } from '../types'
import { ChevronRight, ChevronLeft } from 'lucide-react'

interface UIProps {
    phase: Phase
    setPhase: (phase: Phase) => void
    nextPhase: () => void
    prevPhase: () => void
    mode: ModeLevel
}

export function UI({ phase, setPhase, nextPhase, prevPhase, mode }: UIProps) {
    const phases = getPhasesForMode(mode)
    const description = getDescriptionForPhase(phase)

    return (
        <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '800px', textAlign: 'center', color: 'white', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ background: 'rgba(0,0,0,0.6)', padding: '24px', borderRadius: '24px', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '2rem', fontWeight: 600, background: 'linear-gradient(to right, #4488ff, #00ffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{phase}</h2>
                <p style={{ margin: '0 0 24px 0', opacity: 0.9, fontSize: '1.1rem', lineHeight: 1.4 }}>{description}</p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button onClick={prevPhase} style={btnStyle} title="Anterior"><ChevronLeft size={24} /></button>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '400px' }}>
                        {phases.map((p) => (
                            <div
                                key={p}
                                onClick={() => setPhase(p)}
                                title={p}
                                style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: phase === p ? '#4488ff' : 'rgba(255,255,255,0.2)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    transform: phase === p ? 'scale(1.3)' : 'scale(1)'
                                }}
                            />
                        ))}
                    </div>

                    <button onClick={nextPhase} style={btnStyle} title="Próximo"><ChevronRight size={24} /></button>
                </div>

                <div style={{ marginTop: '16px', fontSize: '0.9rem', opacity: 0.6 }}>
                    Fase {phases.indexOf(phase) + 1} de {phases.length}
                </div>
            </div>
        </div>
    )
}

const btnStyle = {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
    outline: 'none'
} as React.CSSProperties


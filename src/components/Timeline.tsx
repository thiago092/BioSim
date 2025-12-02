import type { Phase, ModeLevel } from '../types'
import { getPhasesForMode } from '../types'

interface TimelineProps {
    phase: Phase
    mode: ModeLevel
    setPhase: (phase: Phase) => void
}

export function Timeline({ phase, mode, setPhase }: TimelineProps) {
    const phases = getPhasesForMode(mode)
    const currentIndex = phases.indexOf(phase)
    const progress = ((currentIndex + 1) / phases.length) * 100

    return (
        <div style={{
            position: 'absolute',
            top: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            maxWidth: '800px',
        }}>
            <div style={{
                background: 'rgba(20, 20, 30, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px',
            }}>
                {/* Barra de progresso */}
                <div style={{
                    position: 'relative',
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '16px',
                }}>
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: `${progress}%`,
                        background: 'linear-gradient(to right, #4488ff, #00ffff)',
                        transition: 'width 0.5s ease',
                        borderRadius: '4px',
                    }} />
                </div>

                {/* Lista de fases */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                }}>
                    {phases.map((p, i) => (
                        <button
                            key={p}
                            onClick={() => setPhase(p)}
                            style={{
                                padding: '8px 12px',
                                background: phase === p
                                    ? 'linear-gradient(135deg, #4488ff, #00ffff)'
                                    : i < currentIndex
                                        ? 'rgba(100, 255, 100, 0.2)'
                                        : 'rgba(255, 255, 255, 0.05)',
                                border: phase === p
                                    ? '1px solid rgba(68, 136, 255, 0.5)'
                                    : '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: phase === p ? '600' : '400',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                position: 'relative',
                            }}
                            onMouseEnter={(e) => {
                                if (phase !== p) {
                                    e.currentTarget.style.background = 'rgba(68, 136, 255, 0.15)'
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (phase !== p) {
                                    e.currentTarget.style.background = i < currentIndex
                                        ? 'rgba(100, 255, 100, 0.2)'
                                        : 'rgba(255, 255, 255, 0.05)'
                                }
                            }}
                        >
                            {i < currentIndex && phase !== p && (
                                <span style={{
                                    position: 'absolute',
                                    left: '4px',
                                    top: '4px',
                                    fontSize: '0.7rem',
                                }}>✓</span>
                            )}
                            {p}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

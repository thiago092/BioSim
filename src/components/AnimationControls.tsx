import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Gauge, SkipForward, SkipBack } from 'lucide-react'
import type { Phase, ModeLevel } from '../types'
import { getPhasesForMode } from '../types'

interface AnimationControlsProps {
    phase: Phase
    mode: ModeLevel
    nextPhase: () => void
    prevPhase: () => void
    setPhase: (phase: Phase) => void
    generation: number
    onGenerationComplete: () => void
    isPlaying: boolean
    setIsPlaying: (playing: boolean) => void
}

export function AnimationControls({
    phase,
    mode,
    nextPhase,
    prevPhase,
    setPhase,
    generation,
    onGenerationComplete,
    isPlaying,
    setIsPlaying
}: AnimationControlsProps) {
    const [speed, setSpeed] = useState(2000) // ms entre fases

    const phases = getPhasesForMode(mode)
    const currentIndex = phases.indexOf(phase)
    const totalCells = generation > 0 ? Math.pow(2, generation) : 1

    useEffect(() => {
        if (!isPlaying) return

        const interval = setInterval(() => {
            const phases = getPhasesForMode(mode)
            const currentIdx = phases.indexOf(phase)
            const isLastPhase = currentIdx === phases.length - 1

            // Avança para próxima fase
            nextPhase()

            // Se ERA a última fase, incrementa geração APÓS avançar
            if (isLastPhase && generation < 10) {
                // Aguarda um pouco para mostrar a última fase antes de reiniciar
                setTimeout(() => {
                    onGenerationComplete()
                }, speed / 2)
            }
        }, speed)

        return () => clearInterval(interval)
    }, [isPlaying, speed, nextPhase, phase, mode, onGenerationComplete, generation])

    const reset = () => {
        const phases = getPhasesForMode(mode)
        setPhase(phases[0])
        setIsPlaying(false)
    }

    const togglePlay = () => {
        setIsPlaying(!isPlaying)
    }

    const speeds = [
        { label: 'Lento', value: 3000 },
        { label: 'Normal', value: 2000 },
        { label: 'Rápido', value: 1000 },
    ]

    const controlBtnStyle: React.CSSProperties = {
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '10px',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        cursor: 'pointer',
        transition: 'all 0.2s',
    }

    return (
        <div style={{
            position: 'absolute',
            bottom: 200,
            left: 30,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            minWidth: '280px',
        }}>
            {/* Painel principal */}
            <div style={{
                background: 'rgba(20, 20, 30, 0.95)',
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(68, 136, 255, 0.3)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}>
                {/* Contador de gerações */}
                {generation > 0 && (
                    <div style={{
                        marginBottom: '16px',
                        padding: '12px',
                        background: 'rgba(68, 136, 255, 0.15)',
                        borderRadius: '12px',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            fontSize: '0.8rem',
                            color: 'rgba(255, 255, 255, 0.6)',
                            marginBottom: '4px',
                        }}>
                            Geração Atual
                        </div>
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            background: 'linear-gradient(to right, #4488ff, #00ffff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            {generation}
                        </div>
                        <div style={{
                            fontSize: '0.75rem',
                            color: 'rgba(100, 255, 100, 0.8)',
                            marginTop: '4px',
                        }}>
                            {totalCells} célula{totalCells > 1 ? 's' : ''}
                        </div>
                    </div>
                )}

                {/* Botões de controle principais */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <button
                        onClick={prevPhase}
                        style={{
                            ...controlBtnStyle,
                            flex: 0,
                        }}
                        title="Fase Anterior"
                    >
                        <SkipBack size={20} />
                    </button>

                    <button
                        onClick={togglePlay}
                        style={{
                            ...controlBtnStyle,
                            flex: 1,
                            background: isPlaying
                                ? 'linear-gradient(135deg, #ff4444, #ff8844)'
                                : 'linear-gradient(135deg, #4488ff, #00ffff)',
                        }}
                        title={isPlaying ? 'Pausar' : 'Reproduzir'}
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                        <span style={{ marginLeft: '8px', fontWeight: '600' }}>
                            {isPlaying ? 'Pausar' : 'Reproduzir'}
                        </span>
                    </button>

                    <button
                        onClick={nextPhase}
                        style={{
                            ...controlBtnStyle,
                            flex: 0,
                        }}
                        title="Próxima Fase"
                    >
                        <SkipForward size={20} />
                    </button>
                </div>

                {/* Botão Reset */}
                <button
                    onClick={() => {
                        reset()
                        if (generation > 0) {
                            const phases = getPhasesForMode(mode)
                            setPhase(phases[0])
                        }
                    }}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '10px',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontWeight: '600',
                        marginBottom: '12px',
                    }}
                    title="Reiniciar"
                >
                    <RotateCcw size={18} />
                    Reiniciar
                </button>

                {/* Progresso do ciclo */}
                <div style={{
                    marginBottom: '12px',
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '6px',
                    }}>
                        <span>Progresso do Ciclo</span>
                        <span>{currentIndex + 1} / {phases.length}</span>
                    </div>
                    <div style={{
                        height: '6px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${((currentIndex + 1) / phases.length) * 100}%`,
                            background: 'linear-gradient(to right, #4488ff, #00ffff)',
                            transition: 'width 0.3s',
                        }} />
                    </div>
                </div>

                {/* Controle de velocidade */}
                <div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px'
                    }}>
                        <Gauge size={16} style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                        <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                            Velocidade
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                        {speeds.map((s) => (
                            <button
                                key={s.value}
                                onClick={() => setSpeed(s.value)}
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    background: speed === s.value ? 'rgba(68, 136, 255, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                                    border: speed === s.value ? '1px solid rgba(68, 136, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '6px',
                                    color: 'white',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontWeight: speed === s.value ? '600' : '400',
                                }}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

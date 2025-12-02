import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useState, useEffect } from 'react'
import { Scene } from '../../components/Scene'
import { InfoPanel } from '../../components/InfoPanel'
import { GenerationExplanation } from '../../components/GenerationExplanation'
import type { Phase, ModeLevel } from '../../types'
import { getPhasesForMode, MODE_NAMES } from '../../types'
import { Play, Pause, RotateCcw, SkipForward, SkipBack, ChevronDown, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export function CellDivisionSimulator() {
    const [mode, setMode] = useState<ModeLevel>('basic')
    const [phase, setPhase] = useState<Phase>('Intérfase')
    const [generation, setGeneration] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [showExplanation, setShowExplanation] = useState(false)
    const [speed, setSpeed] = useState(2000)
    const [showModeMenu, setShowModeMenu] = useState(false)

    const phases = getPhasesForMode(mode)
    const currentIndex = phases.indexOf(phase)
    const totalCells = generation > 0 ? Math.pow(2, generation) : 1

    useEffect(() => {
        if (generation > 0) {
            setShowExplanation(true)
            const timer = setTimeout(() => setShowExplanation(false), 4000)
            return () => clearTimeout(timer)
        }
    }, [generation])

    useEffect(() => {
        if (!isPlaying) return

        const interval = setInterval(() => {
            const currentIdx = phases.indexOf(phase)
            const isLastPhase = currentIdx === phases.length - 1

            if (isLastPhase) {
                setPhase(phases[0])
                if (generation < 10) {
                    setTimeout(() => setGeneration(prev => prev + 1), speed / 2)
                }
            } else {
                setPhase(phases[currentIdx + 1])
            }
        }, speed)

        return () => clearInterval(interval)
    }, [isPlaying, speed, phase, phases, generation])

    const handleModeChange = (newMode: ModeLevel) => {
        setMode(newMode)
        const newPhases = getPhasesForMode(newMode)
        setPhase(newPhases[0])
        setGeneration(0)
        setShowModeMenu(false)
    }

    const nextPhase = () => {
        const nextIdx = (currentIndex + 1) % phases.length
        setPhase(phases[nextIdx])
    }

    const prevPhase = () => {
        const prevIdx = (currentIndex - 1 + phases.length) % phases.length
        setPhase(phases[prevIdx])
    }

    const reset = () => {
        setPhase(phases[0])
        setIsPlaying(false)
        setGeneration(0)
    }

    // Descrições das fases
    const phaseDescriptions: Partial<Record<Phase, string>> = {
        'Intérfase': 'A célula cresce e duplica seu DNA, preparando-se para a divisão.',
        'Prófase': 'Cromossomos condensam. Centríolos migram para polos opostos.',
        'Metáfase': 'Cromossomos alinham-se no centro da célula (placa equatorial).',
        'Anáfase': 'Cromátides irmãs são separadas e puxadas para polos opostos.',
        'Telófase': 'Novos envelopes nucleares formam-se ao redor dos cromossomos.',
        'Citocinese': 'O citoplasma se divide, formando duas células-filhas.',
        'Células-Filhas': 'Divisão completa! Duas células idênticas foram criadas.',
        'Intérfase-G1': 'Fase de crescimento. A célula produz proteínas e organelas.',
        'Intérfase-S': 'Síntese de DNA. Cada cromossomo é replicado.',
        'Intérfase-G2': 'Preparação final. Verificação do DNA antes da divisão.',
        'Prófase-I': 'Cromossomos homólogos pareiam-se (sinapse).',
        'Crossing-Over': 'Troca de material genético entre cromossomos homólogos.',
        'Metáfase-I': 'Pares de homólogos alinham-se na placa equatorial.',
        'Anáfase-I': 'Cromossomos homólogos são separados para polos opostos.',
        'Telófase-I': 'Duas células haploides são formadas.',
    }

    const description = phaseDescriptions[phase] || 'Observe as mudanças estruturais nesta fase.'

    return (
        <div style={{ 
            width: '100vw', 
            height: '100vh', 
            background: '#050510',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Canvas 3D */}
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <color attach="background" args={['#050510']} />
                <Suspense fallback={null}>
                    <Environment preset="studio" blur={1} />
                    <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
                    <Scene
                        phase={phase}
                        mode={mode}
                        generation={generation}
                        isContinuousMode={generation > 0}
                        isPlaying={isPlaying}
                    />
                    <OrbitControls makeDefault />
                    <EffectComposer>
                        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={0.4} />
                    </EffectComposer>
                </Suspense>
            </Canvas>

            {/* ===== TOP LEFT - Logo & Home ===== */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                zIndex: 20
            }}>
                <Link to="/" style={{
                    background: 'rgba(20, 20, 30, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textDecoration: 'none',
                }}>
                    <Home size={20} />
                </Link>
                <div style={{ color: 'white' }}>
                    <h1 style={{ 
                        margin: 0, 
                        fontSize: '1.4rem', 
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #fff, #667eea)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        🔬 Divisão Celular
                    </h1>
                    <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.6 }}>
                        Prof. Anayram Martins
                    </p>
                </div>
            </div>

            {/* ===== TOP RIGHT - Mode Selector ===== */}
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 20
            }}>
                <button
                    onClick={() => setShowModeMenu(!showModeMenu)}
                    style={{
                        background: 'rgba(20, 20, 30, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(68, 136, 255, 0.3)',
                        borderRadius: '10px',
                        padding: '10px 16px',
                        color: 'white',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    📚 {MODE_NAMES[mode]}
                    <ChevronDown size={16} style={{ 
                        transform: showModeMenu ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.2s'
                    }} />
                </button>
                
                {showModeMenu && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '8px',
                        background: 'rgba(20, 20, 30, 0.98)',
                        backdropFilter: 'blur(15px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        minWidth: '200px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                    }}>
                        {(['basic', 'intermediate', 'advanced'] as ModeLevel[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => handleModeChange(m)}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    background: mode === m ? 'rgba(68, 136, 255, 0.2)' : 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    color: 'white',
                                    fontSize: '0.85rem',
                                    fontWeight: mode === m ? '700' : '500',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                {mode === m && '✓'} {MODE_NAMES[m]}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ===== TOP CENTER - Timeline ===== */}
            <div style={{
                position: 'absolute',
                top: '75px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'calc(100% - 40px)',
                maxWidth: '800px',
                zIndex: 10
            }}>
                <div style={{
                    background: 'rgba(15, 15, 25, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                }}>
                    {/* Progress bar */}
                    <div style={{
                        height: '4px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '2px',
                        marginBottom: '8px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${((currentIndex + 1) / phases.length) * 100}%`,
                            background: 'linear-gradient(90deg, #4488ff, #00ffff)',
                            transition: 'width 0.3s ease',
                            borderRadius: '2px'
                        }} />
                    </div>
                    
                    {/* Phase buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '4px',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        {phases.map((p, i) => (
                            <button
                                key={p}
                                onClick={() => setPhase(p)}
                                style={{
                                    padding: '5px 8px',
                                    background: phase === p 
                                        ? 'linear-gradient(135deg, #4488ff, #00c8ff)' 
                                        : i < currentIndex 
                                            ? 'rgba(34, 197, 94, 0.2)' 
                                            : 'rgba(255,255,255,0.05)',
                                    border: phase === p 
                                        ? '1px solid rgba(68, 136, 255, 0.5)' 
                                        : '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '5px',
                                    color: 'white',
                                    fontSize: '0.65rem',
                                    fontWeight: phase === p ? '700' : '500',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {i < currentIndex && phase !== p && <span style={{ marginRight: '3px' }}>✓</span>}
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== BOTTOM LEFT - Animation Controls ===== */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                zIndex: 20
            }}>
                <div style={{
                    background: 'rgba(15, 15, 25, 0.95)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(68, 136, 255, 0.3)',
                    borderRadius: '14px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    minWidth: '160px'
                }}>
                    <div style={{ 
                        fontSize: '0.7rem', 
                        color: 'rgba(255,255,255,0.5)', 
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontWeight: '600',
                        textAlign: 'center'
                    }}>
                        Controles
                    </div>
                    
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button onClick={prevPhase} style={btnStyle}>
                            <SkipBack size={16} />
                        </button>
                        <button 
                            onClick={() => setIsPlaying(!isPlaying)} 
                            style={{
                                ...btnStyle,
                                background: isPlaying 
                                    ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                                    : 'linear-gradient(135deg, #22c55e, #16a34a)',
                                border: 'none',
                                width: '44px'
                            }}
                        >
                            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                        </button>
                        <button onClick={nextPhase} style={btnStyle}>
                            <SkipForward size={16} />
                        </button>
                    </div>
                    
                    <button onClick={reset} style={{
                        ...btnStyle,
                        width: '100%',
                        gap: '6px',
                        fontSize: '0.75rem'
                    }}>
                        <RotateCcw size={12} /> Reiniciar
                    </button>

                    {/* Speed Control */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '3px',
                        background: 'rgba(0,0,0,0.2)',
                        borderRadius: '6px',
                        padding: '3px'
                    }}>
                        {[
                            { label: '🐢', value: 3000 },
                            { label: '🚶', value: 2000 },
                            { label: '🏃', value: 1000 },
                        ].map((s) => (
                            <button
                                key={s.value}
                                onClick={() => setSpeed(s.value)}
                                style={{
                                    flex: 1,
                                    padding: '5px',
                                    background: speed === s.value ? 'rgba(68, 136, 255, 0.3)' : 'transparent',
                                    border: 'none',
                                    borderRadius: '5px',
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer'
                                }}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats (se houver gerações) */}
                {generation > 0 && (
                    <div style={{
                        marginTop: '10px',
                        background: 'rgba(15, 15, 25, 0.95)',
                        backdropFilter: 'blur(15px)',
                        border: '1px solid rgba(118, 75, 162, 0.3)',
                        borderRadius: '12px',
                        padding: '12px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>
                            📊 Estatísticas
                        </div>
                        <div style={{ 
                            display: 'flex', 
                            gap: '6px' 
                        }}>
                            <div style={{
                                flex: 1,
                                background: 'rgba(102, 126, 234, 0.2)',
                                borderRadius: '6px',
                                padding: '6px'
                            }}>
                                <div style={{ fontSize: '0.55rem', opacity: 0.7 }}>Geração</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#667eea' }}>
                                    {generation}
                                </div>
                            </div>
                            <div style={{
                                flex: 1,
                                background: 'rgba(118, 75, 162, 0.2)',
                                borderRadius: '6px',
                                padding: '6px'
                            }}>
                                <div style={{ fontSize: '0.55rem', opacity: 0.7 }}>Células</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#764ba2' }}>
                                    {totalCells}
                                </div>
                            </div>
                        </div>
                        <div style={{
                            marginTop: '6px',
                            fontSize: '0.7rem',
                            color: '#22c55e',
                            fontFamily: 'monospace'
                        }}>
                            2^{generation} = {totalCells}
                        </div>
                    </div>
                )}
            </div>

            {/* ===== BOTTOM RIGHT - Phase Description ===== */}
            <div style={{
                position: 'absolute',
                right: '20px',
                bottom: '20px',
                maxWidth: '280px',
                zIndex: 15
            }}>
                <div style={{
                    background: 'rgba(10, 10, 25, 0.95)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(157, 78, 221, 0.4)',
                    borderRadius: '12px',
                    padding: '14px',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px'
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #9d4edd, #c77dff)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem'
                        }}>
                            📖
                        </div>
                        <div>
                            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                                Fase Atual
                            </div>
                            <div style={{
                                fontSize: '0.95rem',
                                fontWeight: '700',
                                background: 'linear-gradient(135deg, #c77dff, #e0aaff)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                {phase}
                            </div>
                        </div>
                    </div>
                    <div style={{
                        fontSize: '0.8rem',
                        lineHeight: '1.4',
                        color: 'rgba(255,255,255,0.85)',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        paddingTop: '8px'
                    }}>
                        {description}
                    </div>
                </div>
            </div>

            {/* Info Panel Button (glossary) */}
            <InfoPanel mode={mode} />

            {/* Generation Explanation Modal */}
            {showExplanation && (
                <GenerationExplanation
                    generation={generation}
                    onClose={() => setShowExplanation(false)}
                />
            )}

            {/* Footer tip */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'rgba(255,255,255,0.35)',
                fontSize: '0.7rem',
                pointerEvents: 'none',
                whiteSpace: 'nowrap'
            }}>
                💡 Arraste para rotacionar • Scroll para zoom
            </div>
        </div>
    )
}

// Estilo padrão para botões
const btnStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    cursor: 'pointer',
}

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useState, useEffect } from 'react'
import { Scene } from '../../components/Scene'
import { GenerationExplanation } from '../../components/GenerationExplanation'
import type { Phase, ModeLevel } from '../../types'
import { getPhasesForMode, MODE_NAMES } from '../../types'
import { Play, Pause, RotateCcw, SkipForward, SkipBack, ChevronDown, Home, HelpCircle, X } from 'lucide-react'
import { Link } from 'react-router-dom'

// Glossário de termos
const glossary = [
    { term: 'Cromossomo', def: 'Estrutura de DNA e proteínas com informação genética.' },
    { term: 'Centríolo', def: 'Organiza as fibras do fuso durante a divisão.' },
    { term: 'Citocinese', def: 'Divisão do citoplasma formando duas células.' },
    { term: 'Fuso Mitótico', def: 'Fibras que separam os cromossomos.' },
    { term: 'Cromatina', def: 'DNA + proteínas que formam cromossomos.' },
]

export function CellDivisionSimulator() {
    const [mode, setMode] = useState<ModeLevel>('basic')
    const [phase, setPhase] = useState<Phase>('Intérfase')
    const [generation, setGeneration] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [showExplanation, setShowExplanation] = useState(false)
    const [speed, setSpeed] = useState(2000)
    const [showModeMenu, setShowModeMenu] = useState(false)
    const [showHelp, setShowHelp] = useState(false)

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
                if (generation < 10) setTimeout(() => setGeneration(prev => prev + 1), speed / 2)
            } else {
                setPhase(phases[currentIdx + 1])
            }
        }, speed)
        return () => clearInterval(interval)
    }, [isPlaying, speed, phase, phases, generation])

    const handleModeChange = (newMode: ModeLevel) => {
        setMode(newMode)
        setPhase(getPhasesForMode(newMode)[0])
        setGeneration(0)
        setShowModeMenu(false)
    }

    const nextPhase = () => setPhase(phases[(currentIndex + 1) % phases.length])
    const prevPhase = () => setPhase(phases[(currentIndex - 1 + phases.length) % phases.length])
    const reset = () => { setPhase(phases[0]); setIsPlaying(false); setGeneration(0) }

    const phaseDescriptions: Partial<Record<Phase, string>> = {
        'Intérfase': 'A célula cresce e duplica seu DNA.',
        'Prófase': 'Cromossomos condensam.',
        'Metáfase': 'Cromossomos alinham-se no centro.',
        'Anáfase': 'Cromátides são separadas.',
        'Telófase': 'Núcleos se formam.',
        'Citocinese': 'Citoplasma se divide.',
        'Células-Filhas': 'Divisão completa!',
    }

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#050510', overflow: 'hidden' }}>
            {/* 3D Canvas */}
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <color attach="background" args={['#050510']} />
                <Suspense fallback={null}>
                    <Environment preset="studio" blur={1} />
                    <Stars radius={100} depth={50} count={2000} factor={3} fade speed={1} />
                    <Scene phase={phase} mode={mode} generation={generation} isContinuousMode={generation > 0} isPlaying={isPlaying} />
                    <OrbitControls makeDefault enablePan={false} minDistance={4} maxDistance={15} />
                    <EffectComposer>
                        <Bloom luminanceThreshold={0.3} intensity={0.3} />
                    </EffectComposer>
                </Suspense>
            </Canvas>

            {/* UI OVERLAY - Fixed positioning */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', padding: '12px' }}>
                
                {/* TOP BAR */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pointerEvents: 'auto' }}>
                    {/* Left: Home + Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Link to="/" style={iconBtnStyle}><Home size={18} /></Link>
                        <div style={{ color: 'white' }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>🔬 Divisão Celular</div>
                            <div style={{ fontSize: '0.65rem', opacity: 0.5 }}>Prof. Anayram</div>
                        </div>
                    </div>

                    {/* Right: Mode Selector */}
                    <div style={{ position: 'relative' }}>
                        <button onClick={() => setShowModeMenu(!showModeMenu)} style={dropdownBtnStyle}>
                            📚 {MODE_NAMES[mode]} <ChevronDown size={14} />
                        </button>
                        {showModeMenu && (
                            <div style={dropdownMenuStyle}>
                                {(['basic', 'intermediate', 'advanced'] as ModeLevel[]).map(m => (
                                    <button key={m} onClick={() => handleModeChange(m)} style={{
                                        ...dropdownItemStyle,
                                        background: mode === m ? 'rgba(68,136,255,0.2)' : 'transparent'
                                    }}>
                                        {mode === m && '✓ '}{MODE_NAMES[m]}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* PHASE TIMELINE - Top Center */}
                <div style={{ 
                    marginTop: '10px',
                    display: 'flex', 
                    justifyContent: 'center',
                    pointerEvents: 'auto'
                }}>
                    <div style={timelineStyle}>
                        <div style={{ 
                            height: '3px', 
                            background: 'rgba(255,255,255,0.1)', 
                            borderRadius: '2px',
                            marginBottom: '8px',
                            overflow: 'hidden'
                        }}>
                            <div style={{ 
                                height: '100%', 
                                width: `${((currentIndex + 1) / phases.length) * 100}%`,
                                background: 'linear-gradient(90deg, #4488ff, #00ffff)',
                                transition: 'width 0.3s'
                            }} />
                        </div>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {phases.map((p, i) => (
                                <button key={p} onClick={() => setPhase(p)} style={{
                                    padding: '4px 8px',
                                    fontSize: '0.6rem',
                                    background: phase === p ? 'linear-gradient(135deg, #4488ff, #00c8ff)' : 'rgba(255,255,255,0.05)',
                                    border: '1px solid ' + (phase === p ? 'rgba(68,136,255,0.5)' : 'rgba(255,255,255,0.1)'),
                                    borderRadius: '4px',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: phase === p ? '700' : '400'
                                }}>
                                    {i < currentIndex && '✓ '}{p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div style={{ 
                    position: 'absolute', 
                    bottom: '12px', 
                    left: '12px', 
                    right: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    pointerEvents: 'auto'
                }}>
                    {/* Left: Controls */}
                    <div style={panelStyle}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                            <button onClick={prevPhase} style={ctrlBtnStyle}><SkipBack size={16} /></button>
                            <button onClick={() => setIsPlaying(!isPlaying)} style={{
                                ...ctrlBtnStyle,
                                background: isPlaying ? '#ef4444' : '#22c55e',
                                width: '40px'
                            }}>
                                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                            </button>
                            <button onClick={nextPhase} style={ctrlBtnStyle}><SkipForward size={16} /></button>
                            <button onClick={reset} style={ctrlBtnStyle}><RotateCcw size={14} /></button>
                        </div>
                        <div style={{ display: 'flex', gap: '3px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', padding: '2px' }}>
                            {[{ l: '🐢', v: 3000 }, { l: '🚶', v: 2000 }, { l: '🏃', v: 1000 }].map(s => (
                                <button key={s.v} onClick={() => setSpeed(s.v)} style={{
                                    flex: 1,
                                    padding: '4px',
                                    background: speed === s.v ? 'rgba(68,136,255,0.3)' : 'transparent',
                                    border: 'none',
                                    borderRadius: '3px',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer'
                                }}>{s.l}</button>
                            ))}
                        </div>
                        {generation > 0 && (
                            <div style={{ marginTop: '8px', textAlign: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>
                                Gen: <b style={{ color: '#667eea' }}>{generation}</b> | Células: <b style={{ color: '#764ba2' }}>{totalCells}</b>
                            </div>
                        )}
                    </div>

                    {/* Center: Tip */}
                    <div style={{ 
                        color: 'rgba(255,255,255,0.3)', 
                        fontSize: '0.65rem',
                        textAlign: 'center',
                        flex: 1,
                        pointerEvents: 'none'
                    }}>
                        💡 Arraste para girar • Scroll para zoom
                    </div>

                    {/* Right: Phase Info + Help */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                        <div style={{ ...panelStyle, maxWidth: '200px', background: 'rgba(10,10,25,0.95)', borderColor: 'rgba(157,78,221,0.4)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                <span style={{ fontSize: '1.2rem' }}>📖</span>
                                <div>
                                    <div style={{ fontSize: '0.55rem', opacity: 0.5, textTransform: 'uppercase' }}>Fase</div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#c77dff' }}>{phase}</div>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.7rem', lineHeight: 1.4, opacity: 0.85 }}>
                                {phaseDescriptions[phase] || 'Observe as mudanças.'}
                            </div>
                        </div>
                        <button onClick={() => setShowHelp(true)} style={{ ...iconBtnStyle, background: 'rgba(68,136,255,0.2)' }}>
                            <HelpCircle size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* HELP MODAL */}
            {showHelp && (
                <div style={{ 
                    position: 'fixed', 
                    inset: 0, 
                    background: 'rgba(0,0,0,0.8)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    zIndex: 100,
                    padding: '20px'
                }}>
                    <div style={{ 
                        background: 'rgba(20,20,30,0.98)', 
                        borderRadius: '12px', 
                        padding: '20px',
                        maxWidth: '400px',
                        width: '100%',
                        maxHeight: '80vh',
                        overflow: 'auto',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, color: 'white', fontSize: '1.1rem' }}>📚 Glossário</h3>
                            <button onClick={() => setShowHelp(false)} style={iconBtnStyle}><X size={18} /></button>
                        </div>
                        {glossary.map((g, i) => (
                            <div key={i} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ color: '#4488ff', fontWeight: '600', fontSize: '0.85rem' }}>{g.term}</div>
                                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', marginTop: '2px' }}>{g.def}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Generation Modal */}
            {showExplanation && <GenerationExplanation generation={generation} onClose={() => setShowExplanation(false)} />}
        </div>
    )
}

// Styles
const iconBtnStyle: React.CSSProperties = {
    background: 'rgba(20,20,30,0.9)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    padding: '8px',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none'
}

const dropdownBtnStyle: React.CSSProperties = {
    ...iconBtnStyle,
    padding: '8px 12px',
    gap: '6px',
    fontSize: '0.8rem',
    fontWeight: '600'
}

const dropdownMenuStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '6px',
    background: 'rgba(20,20,30,0.98)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    overflow: 'hidden',
    minWidth: '180px',
    zIndex: 50
}

const dropdownItemStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    color: 'white',
    fontSize: '0.8rem',
    cursor: 'pointer',
    textAlign: 'left'
}

const timelineStyle: React.CSSProperties = {
    background: 'rgba(15,15,25,0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '10px 14px',
    maxWidth: '90%',
    width: '700px'
}

const panelStyle: React.CSSProperties = {
    background: 'rgba(15,15,25,0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(68,136,255,0.3)',
    borderRadius: '10px',
    padding: '12px',
    color: 'white'
}

const ctrlBtnStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '6px',
    padding: '8px',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}

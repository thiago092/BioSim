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

const glossary = [
    { term: 'Cromossomo', def: 'Estrutura de DNA e proteínas.' },
    { term: 'Centríolo', def: 'Organiza fibras do fuso.' },
    { term: 'Citocinese', def: 'Divisão do citoplasma.' },
    { term: 'Fuso Mitótico', def: 'Fibras que separam cromossomos.' },
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
            const idx = phases.indexOf(phase)
            if (idx === phases.length - 1) {
                setPhase(phases[0])
                if (generation < 10) setTimeout(() => setGeneration(g => g + 1), speed / 2)
            } else {
                setPhase(phases[idx + 1])
            }
        }, speed)
        return () => clearInterval(interval)
    }, [isPlaying, speed, phase, phases, generation])

    const handleModeChange = (m: ModeLevel) => {
        setMode(m)
        setPhase(getPhasesForMode(m)[0])
        setGeneration(0)
        setShowModeMenu(false)
    }

    const descriptions: Partial<Record<Phase, string>> = {
        'Intérfase': 'Célula cresce e duplica DNA.',
        'Prófase': 'Cromossomos condensam.',
        'Metáfase': 'Alinhamento no centro.',
        'Anáfase': 'Separação das cromátides.',
        'Telófase': 'Núcleos se formam.',
        'Citocinese': 'Divisão do citoplasma.',
        'Células-Filhas': 'Divisão completa!',
    }

    return (
        <div className="cell-sim">
            <style>{`
                .cell-sim {
                    width: 100vw;
                    height: 100vh;
                    background: #050510;
                    overflow: hidden;
                    position: relative;
                }
                .cell-sim .ui-overlay {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    padding: 0.75rem;
                    display: flex;
                    flex-direction: column;
                }
                .cell-sim .top-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    pointer-events: auto;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }
                .cell-sim .icon-btn {
                    background: rgba(20,20,30,0.9);
                    border: 1px solid rgba(255,255,255,0.15);
                    border-radius: 0.5rem;
                    padding: 0.5rem;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                    transition: all 0.2s;
                }
                .cell-sim .icon-btn:hover {
                    background: rgba(68,136,255,0.3);
                    border-color: rgba(68,136,255,0.5);
                }
                .cell-sim .left-header {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    color: white;
                }
                .cell-sim .title {
                    font-size: 1rem;
                    font-weight: 700;
                }
                .cell-sim .subtitle {
                    font-size: 0.6rem;
                    opacity: 0.5;
                }
                .cell-sim .dropdown {
                    position: relative;
                }
                .cell-sim .dropdown-btn {
                    background: rgba(20,20,30,0.9);
                    border: 1px solid rgba(68,136,255,0.3);
                    border-radius: 0.5rem;
                    padding: 0.4rem 0.75rem;
                    color: white;
                    font-size: 0.75rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }
                .cell-sim .dropdown-menu {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    margin-top: 0.4rem;
                    background: rgba(20,20,30,0.98);
                    border: 1px solid rgba(255,255,255,0.15);
                    border-radius: 0.5rem;
                    overflow: hidden;
                    min-width: 10rem;
                    z-index: 50;
                }
                .cell-sim .dropdown-item {
                    width: 100%;
                    padding: 0.6rem 0.8rem;
                    border: none;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    color: white;
                    font-size: 0.75rem;
                    cursor: pointer;
                    text-align: left;
                    background: transparent;
                }
                .cell-sim .dropdown-item:hover, .cell-sim .dropdown-item.active {
                    background: rgba(68,136,255,0.2);
                }
                .cell-sim .timeline {
                    position: absolute;
                    bottom: 5rem;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    justify-content: center;
                    pointer-events: auto;
                    width: 90%;
                    max-width: 40rem;
                }
                .cell-sim .timeline-box {
                    background: rgba(15,15,25,0.9);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 0.6rem;
                    padding: 0.5rem 0.6rem;
                    width: 100%;
                }
                .cell-sim .progress-bar {
                    height: 0.2rem;
                    background: rgba(255,255,255,0.1);
                    border-radius: 0.1rem;
                    margin-bottom: 0.5rem;
                    overflow: hidden;
                }
                .cell-sim .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #4488ff, #00ffff);
                    transition: width 0.3s;
                    border-radius: 0.1rem;
                }
                .cell-sim .phase-btns {
                    display: flex;
                    gap: 0.25rem;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .cell-sim .phase-btn {
                    padding: 0.25rem 0.5rem;
                    font-size: 0.55rem;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 0.25rem;
                    color: white;
                    cursor: pointer;
                    white-space: nowrap;
                }
                .cell-sim .phase-btn.active {
                    background: linear-gradient(135deg, #4488ff, #00c8ff);
                    border-color: rgba(68,136,255,0.5);
                    font-weight: 700;
                }
                .cell-sim .bottom-bar {
                    position: absolute;
                    bottom: 0.5rem;
                    left: 0.5rem;
                    right: 0.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    pointer-events: auto;
                    gap: 0.4rem;
                    flex-wrap: wrap;
                }
                .cell-sim .panel {
                    background: rgba(15,15,25,0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(68,136,255,0.3);
                    border-radius: 0.6rem;
                    padding: 0.75rem;
                    color: white;
                }
                .cell-sim .ctrl-row {
                    display: flex;
                    gap: 0.4rem;
                    margin-bottom: 0.5rem;
                }
                .cell-sim .ctrl-btn {
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 0.4rem;
                    padding: 0.5rem;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .cell-sim .ctrl-btn:hover {
                    background: rgba(255,255,255,0.2);
                }
                .cell-sim .play-btn {
                    width: 2.5rem;
                }
                .cell-sim .play-btn.playing { background: #ef4444; }
                .cell-sim .play-btn.paused { background: #22c55e; }
                .cell-sim .speed-row {
                    display: flex;
                    gap: 0.2rem;
                    background: rgba(0,0,0,0.3);
                    border-radius: 0.25rem;
                    padding: 0.15rem;
                }
                .cell-sim .speed-btn {
                    flex: 1;
                    padding: 0.25rem;
                    background: transparent;
                    border: none;
                    border-radius: 0.2rem;
                    font-size: 0.75rem;
                    cursor: pointer;
                }
                .cell-sim .speed-btn.active {
                    background: rgba(68,136,255,0.3);
                }
                .cell-sim .stats {
                    margin-top: 0.5rem;
                    text-align: center;
                    font-size: 0.65rem;
                    color: rgba(255,255,255,0.7);
                }
                .cell-sim .tip {
                    color: rgba(255,255,255,0.3);
                    font-size: 0.6rem;
                    text-align: center;
                    flex: 1;
                    pointer-events: none;
                    min-width: 8rem;
                }
                .cell-sim .phase-info {
                    max-width: 12rem;
                    background: rgba(10,10,25,0.95);
                    border-color: rgba(157,78,221,0.4);
                }
                .cell-sim .phase-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.4rem;
                }
                .cell-sim .phase-icon { font-size: 1rem; }
                .cell-sim .phase-label {
                    font-size: 0.5rem;
                    opacity: 0.5;
                    text-transform: uppercase;
                }
                .cell-sim .phase-name {
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #c77dff;
                }
                .cell-sim .phase-desc {
                    font-size: 0.65rem;
                    line-height: 1.4;
                    opacity: 0.85;
                }
                .cell-sim .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 100;
                    padding: 1rem;
                }
                .cell-sim .modal {
                    background: rgba(20,20,30,0.98);
                    border-radius: 0.75rem;
                    padding: 1.25rem;
                    max-width: 22rem;
                    width: 100%;
                    max-height: 80vh;
                    overflow: auto;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .cell-sim .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                .cell-sim .modal-title {
                    margin: 0;
                    color: white;
                    font-size: 1rem;
                }
                .cell-sim .glossary-item {
                    margin-bottom: 0.75rem;
                    padding-bottom: 0.75rem;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .cell-sim .glossary-term {
                    color: #4488ff;
                    font-weight: 600;
                    font-size: 0.8rem;
                }
                .cell-sim .glossary-def {
                    color: rgba(255,255,255,0.7);
                    font-size: 0.7rem;
                    margin-top: 0.15rem;
                }
                @media (max-width: 600px) {
                    .cell-sim .tip { display: none; }
                    .cell-sim .phase-info { max-width: 10rem; }
                    .cell-sim .bottom-bar { justify-content: center; }
                }
            `}</style>

            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <color attach="background" args={['#050510']} />
                <Suspense fallback={null}>
                    <Environment preset="studio" blur={1} />
                    <Stars radius={100} depth={50} count={2000} factor={3} fade speed={1} />
                    <Scene phase={phase} mode={mode} generation={generation} isContinuousMode={generation > 0} isPlaying={isPlaying} />
                    <OrbitControls makeDefault enablePan={false} minDistance={4} maxDistance={15} />
                    <EffectComposer><Bloom luminanceThreshold={0.3} intensity={0.3} /></EffectComposer>
                </Suspense>
            </Canvas>

            <div className="ui-overlay">
                <div className="top-bar">
                    <div className="left-header">
                        <Link to="/" className="icon-btn"><Home size={16} /></Link>
                        <div>
                            <div className="title">🔬 Divisão Celular</div>
                            <div className="subtitle">Prof. Anayram</div>
                        </div>
                    </div>
                    <div className="dropdown">
                        <button className="dropdown-btn" onClick={() => setShowModeMenu(!showModeMenu)}>
                            📚 {MODE_NAMES[mode]} <ChevronDown size={12} />
                        </button>
                        {showModeMenu && (
                            <div className="dropdown-menu">
                                {(['basic', 'intermediate', 'advanced'] as ModeLevel[]).map(m => (
                                    <button key={m} className={`dropdown-item ${mode === m ? 'active' : ''}`} onClick={() => handleModeChange(m)}>
                                        {mode === m && '✓ '}{MODE_NAMES[m]}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="timeline">
                    <div className="timeline-box">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${((currentIndex + 1) / phases.length) * 100}%` }} />
                        </div>
                        <div className="phase-btns">
                            {phases.map((p, i) => (
                                <button key={p} className={`phase-btn ${phase === p ? 'active' : ''}`} onClick={() => setPhase(p)}>
                                    {i < currentIndex && '✓ '}{p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bottom-bar">
                    <div className="panel">
                        <div className="ctrl-row">
                            <button className="ctrl-btn" onClick={() => setPhase(phases[(currentIndex - 1 + phases.length) % phases.length])}><SkipBack size={14} /></button>
                            <button className={`ctrl-btn play-btn ${isPlaying ? 'playing' : 'paused'}`} onClick={() => setIsPlaying(!isPlaying)}>
                                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                            </button>
                            <button className="ctrl-btn" onClick={() => setPhase(phases[(currentIndex + 1) % phases.length])}><SkipForward size={14} /></button>
                            <button className="ctrl-btn" onClick={() => { setPhase(phases[0]); setIsPlaying(false); setGeneration(0) }}><RotateCcw size={12} /></button>
                        </div>
                        <div className="speed-row">
                            {[{ l: '🐢', v: 3000 }, { l: '🚶', v: 2000 }, { l: '🏃', v: 1000 }].map(s => (
                                <button key={s.v} className={`speed-btn ${speed === s.v ? 'active' : ''}`} onClick={() => setSpeed(s.v)}>{s.l}</button>
                            ))}
                        </div>
                        {generation > 0 && (
                            <div className="stats">
                                Gen: <b style={{ color: '#667eea' }}>{generation}</b> | Células: <b style={{ color: '#764ba2' }}>{totalCells}</b>
                            </div>
                        )}
                    </div>

                    <div className="tip">💡 Arraste para girar • Scroll para zoom</div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                        <div className="panel phase-info">
                            <div className="phase-header">
                                <span className="phase-icon">📖</span>
                                <div>
                                    <div className="phase-label">Fase</div>
                                    <div className="phase-name">{phase}</div>
                                </div>
                            </div>
                            <div className="phase-desc">{descriptions[phase] || 'Observe.'}</div>
                        </div>
                        <button className="icon-btn" onClick={() => setShowHelp(true)} style={{ background: 'rgba(68,136,255,0.2)' }}>
                            <HelpCircle size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {showHelp && (
                <div className="modal-overlay" onClick={() => setShowHelp(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">📚 Glossário</h3>
                            <button className="icon-btn" onClick={() => setShowHelp(false)}><X size={16} /></button>
                        </div>
                        {glossary.map((g, i) => (
                            <div key={i} className="glossary-item">
                                <div className="glossary-term">{g.term}</div>
                                <div className="glossary-def">{g.def}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showExplanation && <GenerationExplanation generation={generation} onClose={() => setShowExplanation(false)} />}
        </div>
    )
}

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useState } from 'react'
import type { ZoomLevel } from './data/educational-content'
import { ZOOM_LEVELS, PROCESS_LEVELS } from './data/educational-content'
import { ChromosomeView } from './components/ChromosomeView'
import { GeneView } from './components/GeneView'
import { DNAHelixView } from './components/DNAHelixView'
import { BasesPairView } from './components/BasesPairView'
import { ReplicationView } from './components/ReplicationView'
import { TranscriptionView } from './components/TranscriptionView'
import { TranslationView } from './components/TranslationView'
import { ZoomControls } from './components/ZoomControls'
import { EducationalPanel } from './components/EducationalPanel'
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Dna, FlaskConical, BookOpen, Atom, Microscope, FileText, Cog, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

type ViewMode = 'structure' | 'processes'

export function DNAExplorer() {
    const [viewMode, setViewMode] = useState<ViewMode>('structure')
    const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('chromosome')
    const [processLevel, setProcessLevel] = useState<ZoomLevel>('replication')
    const [isPlaying, setIsPlaying] = useState(true)
    const [speed, setSpeed] = useState(1)
    const [showPanel, setShowPanel] = useState(true)
    const [selectedElement, setSelectedElement] = useState<string | null>(null)

    const currentLevel = viewMode === 'structure' ? zoomLevel : processLevel

    const handleZoomIn = () => {
        if (viewMode === 'structure') {
            const currentIndex = ZOOM_LEVELS.indexOf(zoomLevel)
            if (currentIndex < ZOOM_LEVELS.length - 1) {
                setZoomLevel(ZOOM_LEVELS[currentIndex + 1])
            }
        }
    }

    const handleZoomOut = () => {
        if (viewMode === 'structure') {
            const currentIndex = ZOOM_LEVELS.indexOf(zoomLevel)
            if (currentIndex > 0) {
                setZoomLevel(ZOOM_LEVELS[currentIndex - 1])
            }
        }
    }

    const handleReset = () => {
        setZoomLevel('chromosome')
        setProcessLevel('replication')
        setSpeed(1)
        setIsPlaying(true)
    }

    const handleNextProcess = () => {
        const currentIndex = PROCESS_LEVELS.indexOf(processLevel)
        if (currentIndex < PROCESS_LEVELS.length - 1) {
            setProcessLevel(PROCESS_LEVELS[currentIndex + 1])
        }
    }

    const handlePrevProcess = () => {
        const currentIndex = PROCESS_LEVELS.indexOf(processLevel)
        if (currentIndex > 0) {
            setProcessLevel(PROCESS_LEVELS[currentIndex - 1])
        }
    }

    const getCameraPosition = (): [number, number, number] => {
        if (viewMode === 'processes') {
            switch (processLevel) {
                case 'replication': return [0, 0, 10]
                case 'transcription': return [0, 0, 12]
                case 'translation': return [0, 0, 14]
                default: return [0, 0, 10]
            }
        }
        switch (zoomLevel) {
            case 'chromosome': return [0, 0, 8]
            case 'gene': return [0, 0, 6]
            case 'dna': return [0, 0, 5]
            case 'bases': return [0, 0, 4]
            default: return [0, 0, 8]
        }
    }

    const structureViews = [
        { level: 'chromosome' as ZoomLevel, icon: <Microscope size={14} />, label: 'Cromossomo' },
        { level: 'gene' as ZoomLevel, icon: <FileText size={14} />, label: 'Gene' },
        { level: 'dna' as ZoomLevel, icon: <Dna size={14} />, label: 'DNA' },
        { level: 'bases' as ZoomLevel, icon: <Atom size={14} />, label: 'Bases' },
    ]

    const processViews = [
        { level: 'replication' as ZoomLevel, icon: <Cog size={14} />, label: 'Replicação' },
        { level: 'transcription' as ZoomLevel, icon: <FileText size={14} />, label: 'Transcrição' },
        { level: 'translation' as ZoomLevel, icon: <FlaskConical size={14} />, label: 'Tradução' },
    ]

    return (
        <div className="dna-sim">
            <style>{`
                .dna-sim {
                    width: 100vw;
                    height: 100vh;
                    background: #0a0a0f;
                    overflow: hidden;
                    position: relative;
                }
                .dna-sim .ui-overlay {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    padding: 0.6rem;
                    display: flex;
                    flex-direction: column;
                }
                .dna-sim .top-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    pointer-events: auto;
                }
                .dna-sim .header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    width: 100%;
                }
                .dna-sim .left-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: white;
                }
                .dna-sim .icon-btn {
                    background: rgba(20,20,30,0.9);
                    border: 1px solid rgba(255,255,255,0.15);
                    border-radius: 0.4rem;
                    padding: 0.4rem;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                }
                .dna-sim .icon-btn:hover {
                    background: rgba(68,136,255,0.3);
                }
                .dna-sim .title {
                    font-size: 1rem;
                    font-weight: 700;
                    background: linear-gradient(to right, #f093fb, #f5576c);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .dna-sim .subtitle {
                    font-size: 0.55rem;
                    opacity: 0.5;
                }
                .dna-sim .mode-selector {
                    display: flex;
                    gap: 0.3rem;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(10px);
                    padding: 0.25rem;
                    border-radius: 0.5rem;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .dna-sim .mode-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                    padding: 0.4rem 0.75rem;
                    border: none;
                    border-radius: 0.4rem;
                    color: white;
                    font-size: 0.7rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .dna-sim .mode-btn.active-structure {
                    background: linear-gradient(135deg, #f093fb, #f5576c);
                    font-weight: 600;
                }
                .dna-sim .mode-btn.active-process {
                    background: linear-gradient(135deg, #4ade80, #22d3ee);
                    font-weight: 600;
                }
                .dna-sim .mode-btn:not(.active-structure):not(.active-process) {
                    background: transparent;
                }
                .dna-sim .nav-levels {
                    display: flex;
                    gap: 0.3rem;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(10px);
                    padding: 0.3rem;
                    border-radius: 0.5rem;
                    border: 1px solid rgba(255,255,255,0.1);
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .dna-sim .level-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.15rem;
                    padding: 0.4rem 0.6rem;
                    border: 1px solid transparent;
                    border-radius: 0.4rem;
                    color: #94a3b8;
                    font-size: 0.6rem;
                    cursor: pointer;
                    background: transparent;
                    transition: all 0.2s;
                    position: relative;
                }
                .dna-sim .level-btn.active-s {
                    background: rgba(240,147,251,0.3);
                    border-color: #f093fb;
                    color: #f093fb;
                    font-weight: 600;
                }
                .dna-sim .level-btn.active-p {
                    background: rgba(74,222,128,0.3);
                    border-color: #4ade80;
                    color: #4ade80;
                    font-weight: 600;
                }
                .dna-sim .arrow {
                    position: absolute;
                    right: -0.5rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #4b5563;
                    font-size: 0.7rem;
                }
                .dna-sim .bottom-bar {
                    position: absolute;
                    bottom: 0.6rem;
                    left: 0.6rem;
                    right: 0.6rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    pointer-events: auto;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }
                .dna-sim .prof-info {
                    color: white;
                    pointer-events: none;
                }
                .dna-sim .prof-label {
                    font-size: 0.6rem;
                    opacity: 0.7;
                }
                .dna-sim .prof-name {
                    font-size: 0.8rem;
                    font-weight: 700;
                    background: linear-gradient(to right, #4488ff, #00ffff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .dna-sim .prof-social {
                    font-size: 0.55rem;
                    opacity: 0.6;
                }
                .dna-sim .controls-box {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(10px);
                    padding: 0.5rem 0.75rem;
                    border-radius: 0.6rem;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .dna-sim .ctrl-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.4rem;
                    background: rgba(255,255,255,0.1);
                    border: none;
                    border-radius: 0.4rem;
                    color: white;
                    cursor: pointer;
                }
                .dna-sim .ctrl-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }
                .dna-sim .play-btn {
                    padding: 0.5rem;
                    border-radius: 50%;
                }
                .dna-sim .play-btn.playing {
                    background: rgba(239,68,68,0.3);
                    border: 1px solid #ef4444;
                }
                .dna-sim .play-btn.paused {
                    background: rgba(74,222,128,0.3);
                    border: 1px solid #4ade80;
                }
                .dna-sim .speed-ctrl {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                    color: white;
                    font-size: 0.65rem;
                }
                .dna-sim .speed-ctrl input {
                    width: 3.5rem;
                    accent-color: #4ade80;
                }
                .dna-sim .right-btns {
                    display: flex;
                    flex-direction: column;
                    gap: 0.3rem;
                }
                .dna-sim .panel-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                    padding: 0.4rem 0.6rem;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 0.5rem;
                    color: white;
                    font-size: 0.65rem;
                    cursor: pointer;
                }
                .dna-sim .reset-btn {
                    padding: 0.5rem;
                    background: rgba(245,87,108,0.2);
                    border: 1px solid rgba(245,87,108,0.4);
                    border-radius: 0.5rem;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .dna-sim .selected-info {
                    position: absolute;
                    bottom: 3.5rem;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0,0,0,0.85);
                    backdrop-filter: blur(10px);
                    padding: 0.5rem 0.8rem;
                    border-radius: 0.5rem;
                    border: 1px solid rgba(74,222,128,0.4);
                    color: white;
                    font-size: 0.7rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                @media (max-width: 600px) {
                    .dna-sim .speed-ctrl span:first-child { display: none; }
                    .dna-sim .mode-btn span { display: none; }
                }
            `}</style>

            <Canvas camera={{ position: getCameraPosition(), fov: 50 }}>
                <color attach="background" args={['#0a0a0f']} />
                <Suspense fallback={null}>
                    <Environment preset="studio" />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    <ambientLight intensity={0.6} />
                    <pointLight position={[10, 10, 10]} intensity={1.2} />
                    <pointLight position={[-10, -10, -10]} intensity={0.6} color="#4488ff" />
                    <pointLight position={[0, 10, -10]} intensity={0.4} color="#f093fb" />

                    <group>
                        {viewMode === 'structure' && (
                            <>
                                {zoomLevel === 'chromosome' && <ChromosomeView />}
                                {zoomLevel === 'gene' && <GeneView />}
                                {zoomLevel === 'dna' && <DNAHelixView />}
                                {zoomLevel === 'bases' && <BasesPairView />}
                            </>
                        )}
                        {viewMode === 'processes' && (
                            <>
                                {processLevel === 'replication' && <ReplicationView speed={isPlaying ? speed : 0} onSelectElement={setSelectedElement} />}
                                {processLevel === 'transcription' && <TranscriptionView speed={isPlaying ? speed : 0} onSelectElement={setSelectedElement} />}
                                {processLevel === 'translation' && <TranslationView speed={isPlaying ? speed : 0} onSelectElement={setSelectedElement} />}
                            </>
                        )}
                    </group>

                    <OrbitControls makeDefault enablePan enableZoom enableRotate minDistance={3} maxDistance={20} />
                    <EffectComposer><Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={0.8} /></EffectComposer>
                </Suspense>
            </Canvas>

            <div className="ui-overlay">
                <div className="top-section">
                    <div className="header-row">
                        <div className="left-header">
                            <Link to="/" className="icon-btn"><Home size={14} /></Link>
                            <div>
                                <div className="title">🧬 DNA Explorer</div>
                                <div className="subtitle">Prof. Anayram</div>
                            </div>
                        </div>
                        <div className="mode-selector">
                            <button
                                onClick={() => setViewMode('structure')}
                                className={`mode-btn ${viewMode === 'structure' ? 'active-structure' : ''}`}
                            >
                                <Dna size={14} />
                                <span>Estrutura</span>
                            </button>
                            <button
                                onClick={() => setViewMode('processes')}
                                className={`mode-btn ${viewMode === 'processes' ? 'active-process' : ''}`}
                            >
                                <FlaskConical size={14} />
                                <span>Processos</span>
                            </button>
                        </div>
                    </div>

                    {viewMode === 'structure' && (
                        <div className="nav-levels">
                            {structureViews.map((v, i) => (
                                <button
                                    key={v.level}
                                    onClick={() => setZoomLevel(v.level)}
                                    className={`level-btn ${zoomLevel === v.level ? 'active-s' : ''}`}
                                >
                                    {v.icon}
                                    {v.label}
                                    {i < structureViews.length - 1 && <span className="arrow">→</span>}
                                </button>
                            ))}
                        </div>
                    )}

                    {viewMode === 'processes' && (
                        <div className="nav-levels">
                            {processViews.map((v, i) => (
                                <button
                                    key={v.level}
                                    onClick={() => setProcessLevel(v.level)}
                                    className={`level-btn ${processLevel === v.level ? 'active-p' : ''}`}
                                >
                                    {v.icon}
                                    {v.label}
                                    {i < processViews.length - 1 && <span className="arrow">→</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bottom-bar">
                    <div className="prof-info">
                        <div className="prof-label">Aula Professora</div>
                        <div className="prof-name">Anayram Martins</div>
                        <div className="prof-social">📱 @anayrammartins</div>
                    </div>

                    {viewMode === 'processes' && (
                        <div className="controls-box">
                            <button
                                className="ctrl-btn"
                                onClick={handlePrevProcess}
                                disabled={PROCESS_LEVELS.indexOf(processLevel) === 0}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                className={`ctrl-btn play-btn ${isPlaying ? 'playing' : 'paused'}`}
                                onClick={() => setIsPlaying(!isPlaying)}
                            >
                                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                            </button>
                            <div className="speed-ctrl">
                                <span>Vel:</span>
                                <input type="range" min="0.25" max="3" step="0.25" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} />
                                <span>{speed}x</span>
                            </div>
                            <button
                                className="ctrl-btn"
                                onClick={handleNextProcess}
                                disabled={PROCESS_LEVELS.indexOf(processLevel) === PROCESS_LEVELS.length - 1}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}

                    <div className="right-btns">
                        <button className="panel-btn" onClick={() => setShowPanel(!showPanel)}>
                            <BookOpen size={14} />
                            {showPanel ? 'Ocultar' : 'Info'}
                        </button>
                        {viewMode === 'processes' && (
                            <button className="reset-btn" onClick={handleReset}><RotateCcw size={14} /></button>
                        )}
                    </div>
                </div>

                {selectedElement && (
                    <div className="selected-info">
                        <strong style={{ color: '#4ade80' }}>Selecionado:</strong> {selectedElement}
                        <button onClick={() => setSelectedElement(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
                    </div>
                )}
            </div>

            {showPanel && <EducationalPanel level={currentLevel} onClose={() => setShowPanel(false)} />}
            {viewMode === 'structure' && <ZoomControls currentLevel={zoomLevel} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onReset={handleReset} />}
        </div>
    )
}

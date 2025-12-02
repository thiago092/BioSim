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
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Dna, FlaskConical, BookOpen, Atom, Microscope, FileText, Cog } from 'lucide-react'

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
                case 'replication':
                    return [0, 0, 10]
                case 'transcription':
                    return [0, 0, 12]
                case 'translation':
                    return [0, 0, 14]
                default:
                    return [0, 0, 10]
            }
        }
        switch (zoomLevel) {
            case 'chromosome':
                return [0, 0, 8]
            case 'gene':
                return [0, 0, 6]
            case 'dna':
                return [0, 0, 5]
            case 'bases':
                return [0, 0, 4]
            default:
                return [0, 0, 8]
        }
    }

    const handleSelectElement = (element: string) => {
        setSelectedElement(element)
    }

    const structureViews = [
        { level: 'chromosome' as ZoomLevel, icon: <Microscope size={18} />, label: 'Cromossomo' },
        { level: 'gene' as ZoomLevel, icon: <FileText size={18} />, label: 'Gene' },
        { level: 'dna' as ZoomLevel, icon: <Dna size={18} />, label: 'DNA' },
        { level: 'bases' as ZoomLevel, icon: <Atom size={18} />, label: 'Bases' },
    ]

    const processViews = [
        { level: 'replication' as ZoomLevel, icon: <Cog size={18} />, label: 'Replicação' },
        { level: 'transcription' as ZoomLevel, icon: <FileText size={18} />, label: 'Transcrição' },
        { level: 'translation' as ZoomLevel, icon: <FlaskConical size={18} />, label: 'Tradução' },
    ]

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#0a0a0f' }}>
            <Canvas camera={{ position: getCameraPosition(), fov: 50 }}>
                <color attach="background" args={['#0a0a0f']} />
                <Suspense fallback={null}>
                    <Environment preset="studio" />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                    {/* Luzes */}
                    <ambientLight intensity={0.6} />
                    <pointLight position={[10, 10, 10]} intensity={1.2} />
                    <pointLight position={[-10, -10, -10]} intensity={0.6} color="#4488ff" />
                    <pointLight position={[0, 10, -10]} intensity={0.4} color="#f093fb" />

                    {/* Renderiza visualização baseada no modo e nível */}
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
                                {processLevel === 'replication' && (
                                    <ReplicationView
                                        speed={isPlaying ? speed : 0}
                                        onSelectElement={handleSelectElement}
                                    />
                                )}
                                {processLevel === 'transcription' && (
                                    <TranscriptionView
                                        speed={isPlaying ? speed : 0}
                                        onSelectElement={handleSelectElement}
                                    />
                                )}
                                {processLevel === 'translation' && (
                                    <TranslationView
                                        speed={isPlaying ? speed : 0}
                                        onSelectElement={handleSelectElement}
                                    />
                                )}
                            </>
                        )}
                    </group>

                    <OrbitControls
                        makeDefault
                        enablePan={true}
                        enableZoom={true}
                        enableRotate={true}
                        minDistance={3}
                        maxDistance={20}
                    />

                    <EffectComposer>
                        <Bloom
                            luminanceThreshold={0.2}
                            luminanceSmoothing={0.9}
                            height={300}
                            intensity={0.8}
                        />
                    </EffectComposer>
                </Suspense>
            </Canvas>

            {/* Header */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                zIndex: 100,
            }}>
                <h1 style={{
                    margin: 0,
                    fontSize: '2.2rem',
                    fontWeight: '800',
                    letterSpacing: '-0.02em',
                    background: 'linear-gradient(to right, #f093fb, #f5576c)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: 'center',
                }}>
                    🧬 DNA Explorer
                </h1>

                {/* Seletor de Modo */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(10px)',
                    padding: '6px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                    <button
                        onClick={() => setViewMode('structure')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 20px',
                            background: viewMode === 'structure'
                                ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                                : 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: viewMode === 'structure' ? '600' : '400',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <Dna size={18} />
                        Estrutura
                    </button>
                    <button
                        onClick={() => setViewMode('processes')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 20px',
                            background: viewMode === 'processes'
                                ? 'linear-gradient(135deg, #4ade80 0%, #22d3ee 100%)'
                                : 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: viewMode === 'processes' ? '600' : '400',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <FlaskConical size={18} />
                        Processos Moleculares
                    </button>
                </div>
            </div>

            {/* Navegação por níveis - Estrutura */}
            {viewMode === 'structure' && (
                <div style={{
                    position: 'absolute',
                    top: '140px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '8px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(10px)',
                    padding: '8px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    zIndex: 100,
                }}>
                    {structureViews.map((view, index) => (
                        <button
                            key={view.level}
                            onClick={() => setZoomLevel(view.level)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '10px 16px',
                                background: zoomLevel === view.level
                                    ? 'rgba(240, 147, 251, 0.3)'
                                    : 'transparent',
                                border: zoomLevel === view.level
                                    ? '1px solid #f093fb'
                                    : '1px solid transparent',
                                borderRadius: '8px',
                                color: zoomLevel === view.level ? '#f093fb' : '#94a3b8',
                                fontSize: '0.75rem',
                                fontWeight: zoomLevel === view.level ? '600' : '400',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                            }}
                        >
                            {view.icon}
                            {view.label}
                            {index < structureViews.length - 1 && (
                                <div style={{
                                    position: 'absolute',
                                    right: '-12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#4b5563',
                                    fontSize: '16px',
                                }}>
                                    →
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Navegação por níveis - Processos */}
            {viewMode === 'processes' && (
                <div style={{
                    position: 'absolute',
                    top: '140px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '8px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(10px)',
                    padding: '8px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    zIndex: 100,
                }}>
                    {processViews.map((view, index) => (
                        <button
                            key={view.level}
                            onClick={() => setProcessLevel(view.level)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '10px 16px',
                                background: processLevel === view.level
                                    ? 'rgba(74, 222, 128, 0.3)'
                                    : 'transparent',
                                border: processLevel === view.level
                                    ? '1px solid #4ade80'
                                    : '1px solid transparent',
                                borderRadius: '8px',
                                color: processLevel === view.level ? '#4ade80' : '#94a3b8',
                                fontSize: '0.75rem',
                                fontWeight: processLevel === view.level ? '600' : '400',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                            }}
                        >
                            {view.icon}
                            {view.label}
                            {index < processViews.length - 1 && (
                                <div style={{
                                    position: 'absolute',
                                    right: '-12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#4b5563',
                                    fontSize: '16px',
                                }}>
                                    →
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Controles de animação (para processos) */}
            {viewMode === 'processes' && (
                <div style={{
                    position: 'absolute',
                    bottom: '100px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(10px)',
                    padding: '12px 20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    zIndex: 100,
                }}>
                    <button
                        onClick={handlePrevProcess}
                        disabled={PROCESS_LEVELS.indexOf(processLevel) === 0}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            cursor: PROCESS_LEVELS.indexOf(processLevel) === 0 ? 'not-allowed' : 'pointer',
                            opacity: PROCESS_LEVELS.indexOf(processLevel) === 0 ? 0.4 : 1,
                        }}
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '12px',
                            background: isPlaying
                                ? 'rgba(239, 68, 68, 0.3)'
                                : 'rgba(74, 222, 128, 0.3)',
                            border: isPlaying
                                ? '1px solid #ef4444'
                                : '1px solid #4ade80',
                            borderRadius: '50%',
                            color: 'white',
                            cursor: 'pointer',
                        }}
                    >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'white',
                        fontSize: '0.85rem',
                    }}>
                        <span>Velocidade:</span>
                        <input
                            type="range"
                            min="0.25"
                            max="3"
                            step="0.25"
                            value={speed}
                            onChange={(e) => setSpeed(parseFloat(e.target.value))}
                            style={{
                                width: '80px',
                                accentColor: '#4ade80',
                            }}
                        />
                        <span style={{ minWidth: '35px' }}>{speed}x</span>
                    </div>

                    <button
                        onClick={handleNextProcess}
                        disabled={PROCESS_LEVELS.indexOf(processLevel) === PROCESS_LEVELS.length - 1}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            cursor: PROCESS_LEVELS.indexOf(processLevel) === PROCESS_LEVELS.length - 1 ? 'not-allowed' : 'pointer',
                            opacity: PROCESS_LEVELS.indexOf(processLevel) === PROCESS_LEVELS.length - 1 ? 0.4 : 1,
                        }}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {/* Info do Professor */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                color: 'white',
                pointerEvents: 'none',
                textAlign: 'left',
                zIndex: 100,
            }}>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', opacity: 0.9 }}>
                    Aula Professora
                </p>
                <p style={{
                    margin: '2px 0',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    background: 'linear-gradient(to right, #4488ff, #00ffff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Anayram Martins
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>
                    📱 @anayrammartins
                </p>
            </div>

            {/* Toggle do Painel Educativo */}
            <button
                onClick={() => setShowPanel(!showPanel)}
                style={{
                    position: 'absolute',
                    top: '220px',
                    left: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 14px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    zIndex: 100,
                }}
            >
                <BookOpen size={18} />
                {showPanel ? 'Ocultar Info' : 'Mostrar Info'}
            </button>

            {/* Painel Educativo */}
            {showPanel && (
                <EducationalPanel
                    level={currentLevel}
                    onClose={() => setShowPanel(false)}
                />
            )}

            {/* Controles de Zoom (só para estrutura) */}
            {viewMode === 'structure' && (
                <ZoomControls
                    currentLevel={zoomLevel}
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onReset={handleReset}
                />
            )}

            {/* Reset button para processos */}
            {viewMode === 'processes' && (
                <button
                    onClick={handleReset}
                    style={{
                        position: 'absolute',
                        bottom: '30px',
                        right: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '14px',
                        background: 'rgba(245, 87, 108, 0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(245, 87, 108, 0.4)',
                        borderRadius: '12px',
                        color: 'white',
                        cursor: 'pointer',
                        zIndex: 100,
                    }}
                >
                    <RotateCcw size={24} />
                </button>
            )}

            {/* Elemento selecionado info */}
            {selectedElement && (
                <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0, 0, 0, 0.85)',
                    backdropFilter: 'blur(10px)',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(74, 222, 128, 0.4)',
                    color: 'white',
                    fontSize: '0.9rem',
                    zIndex: 100,
                }}>
                    <strong style={{ color: '#4ade80' }}>Selecionado:</strong> {selectedElement}
                    <button
                        onClick={() => setSelectedElement(null)}
                        style={{
                            marginLeft: '12px',
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    )
}

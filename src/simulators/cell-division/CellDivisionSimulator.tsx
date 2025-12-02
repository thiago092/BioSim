import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useState, useEffect } from 'react'
import { Scene } from '../../components/Scene'
import { ModeSelector } from '../../components/ModeSelector'
import { AnimationControls } from '../../components/AnimationControls'
import { Timeline } from '../../components/Timeline'
import { InfoPanel } from '../../components/InfoPanel'
import { GenerationExplanation } from '../../components/GenerationExplanation'
import { PhaseNarrator } from '../../components/PhaseNarrator'
import type { Phase, ModeLevel } from '../../types'
import { getPhasesForMode } from '../../types'
import { Microscope, Layers, FlaskConical } from 'lucide-react'

export function CellDivisionSimulator() {
    const [mode, setMode] = useState<ModeLevel>('basic')
    const [phase, setPhase] = useState<Phase>('Intérfase')
    const [generation, setGeneration] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [showExplanation, setShowExplanation] = useState(false)
    const [selectedCell, setSelectedCell] = useState<{ id: string, phase: string } | null>(null)

    useEffect(() => {
        if (generation > 0) {
            setShowExplanation(true)
            const timer = setTimeout(() => setShowExplanation(false), 5000)
            return () => clearTimeout(timer)
        }
    }, [generation])

    const handleModeChange = (newMode: ModeLevel) => {
        setMode(newMode)
        const phases = getPhasesForMode(newMode)
        setPhase(phases[0])
        setGeneration(0)
        setSelectedCell(null)
    }

    const nextPhase = () => {
        const phases = getPhasesForMode(mode)
        const currentIndex = phases.indexOf(phase)
        const nextIndex = (currentIndex + 1) % phases.length
        setPhase(phases[nextIndex])
    }

    const prevPhase = () => {
        const phases = getPhasesForMode(mode)
        const currentIndex = phases.indexOf(phase)
        const prevIndex = (currentIndex - 1 + phases.length) % phases.length
        setPhase(phases[prevIndex])
    }

    const handleCellClick = (id: string, cellPhase: string) => {
        setSelectedCell({ id, phase: cellPhase })
    }

    const displayPhase = selectedCell ? (selectedCell.phase as Phase) : phase
    const totalCells = generation > 0 ? Math.pow(2, generation) : 1

    // Info sobre o modo atual
    const modeInfo = {
        basic: { name: 'Mitose Básica', icon: Microscope, color: '#4488ff', desc: 'Divisão celular simples' },
        mitosis: { name: 'Mitose Completa', icon: Layers, color: '#22c55e', desc: 'Todas as subfases detalhadas' },
        meiosis: { name: 'Meiose', icon: FlaskConical, color: '#f093fb', desc: 'Divisão reducional para gametas' },
    }

    const currentModeInfo = modeInfo[mode]
    const CurrentIcon = currentModeInfo.icon

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#050510' }}>
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <color attach="background" args={['#050510']} />
                <Suspense fallback={null}>
                    <Environment preset="studio" blur={1} />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                    <Scene
                        phase={phase}
                        mode={mode}
                        generation={generation}
                        isContinuousMode={generation > 0}
                        isPlaying={isPlaying}
                        onCellClick={handleCellClick}
                    />

                    <OrbitControls makeDefault />

                    <EffectComposer>
                        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={0.5} />
                    </EffectComposer>
                </Suspense>
            </Canvas>

            {/* Header com logo e info */}
            <div style={{ 
                position: 'absolute', 
                top: 30, 
                left: 30, 
                color: 'white', 
                pointerEvents: 'none' 
            }}>
                <h1 style={{ 
                    margin: 0, 
                    fontSize: '2.5rem', 
                    fontWeight: '800', 
                    letterSpacing: '-0.02em', 
                    background: 'linear-gradient(135deg, #fff 0%, #667eea 50%, #764ba2 100%)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent' 
                }}>BioSim</h1>
                <p style={{ 
                    margin: '5px 0 0 0', 
                    opacity: 0.8, 
                    fontSize: '1rem', 
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Microscope size={16} />
                    Divisão Celular 3D
                </p>
                
                {/* Badge do modo atual */}
                <div style={{
                    marginTop: '16px',
                    padding: '10px 16px',
                    background: `${currentModeInfo.color}20`,
                    border: `1px solid ${currentModeInfo.color}40`,
                    borderRadius: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    pointerEvents: 'auto'
                }}>
                    <CurrentIcon size={18} color={currentModeInfo.color} />
                    <div>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: currentModeInfo.color }}>
                            {currentModeInfo.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                            {currentModeInfo.desc}
                        </div>
                    </div>
                </div>

                {selectedCell && (
                    <div style={{ 
                        marginTop: '12px', 
                        padding: '8px 14px', 
                        background: 'rgba(68, 136, 255, 0.2)', 
                        border: '1px solid rgba(68, 136, 255, 0.4)',
                        borderRadius: '8px', 
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.85rem'
                    }}>
                        <span style={{ fontSize: '1.1rem' }}>🔍</span>
                        Visualizando Célula #{selectedCell.id}
                    </div>
                )}
            </div>

            {/* Info da Professora */}
            <div style={{ 
                position: 'absolute', 
                top: 30, 
                right: 30, 
                color: 'white', 
                pointerEvents: 'none', 
                textAlign: 'right' 
            }}>
                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', opacity: 0.9 }}>
                    Aula Professora
                </p>
                <p style={{ 
                    margin: '2px 0', 
                    fontSize: '1.3rem', 
                    fontWeight: '700', 
                    background: 'linear-gradient(to right, #667eea, #764ba2)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent' 
                }}>
                    Anayram Martins
                </p>
                <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', opacity: 0.7 }}>
                    📱 @anayrammartins
                </p>
            </div>

            {/* Stats Panel */}
            {generation > 0 && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: 30,
                    transform: 'translateY(-50%)',
                    background: 'rgba(15, 15, 25, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '20px',
                    color: 'white',
                    minWidth: '180px'
                }}>
                    <h4 style={{ 
                        margin: '0 0 16px 0', 
                        fontSize: '0.9rem', 
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'rgba(255,255,255,0.9)'
                    }}>
                        📊 Estatísticas
                    </h4>
                    
                    <div style={{ display: 'grid', gap: '12px' }}>
                        <div style={{
                            background: 'rgba(102, 126, 234, 0.2)',
                            borderRadius: '10px',
                            padding: '12px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '4px' }}>Geração</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#667eea' }}>
                                {generation}
                            </div>
                        </div>
                        
                        <div style={{
                            background: 'rgba(118, 75, 162, 0.2)',
                            borderRadius: '10px',
                            padding: '12px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '4px' }}>Total de Células</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#764ba2' }}>
                                {totalCells}
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(34, 197, 94, 0.2)',
                            borderRadius: '10px',
                            padding: '12px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '4px' }}>Fórmula</div>
                            <div style={{ fontSize: '1rem', fontWeight: '600', color: '#22c55e', fontFamily: 'monospace' }}>
                                2^{generation} = {totalCells}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Timeline phase={displayPhase} mode={mode} setPhase={setPhase} />

            <ModeSelector currentMode={mode} onModeChange={handleModeChange} />

            <AnimationControls
                phase={displayPhase}
                mode={mode}
                nextPhase={nextPhase}
                prevPhase={prevPhase}
                setPhase={setPhase}
                generation={generation}
                onGenerationComplete={() => {
                    if (generation < 10) {
                        setGeneration(prev => prev + 1)
                    }
                }}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
            />

            <InfoPanel phase={displayPhase} mode={mode} />

            {showExplanation && (
                <GenerationExplanation
                    generation={generation}
                    onClose={() => setShowExplanation(false)}
                />
            )}

            <PhaseNarrator phase={displayPhase} />

            {/* Footer com dica */}
            <div style={{
                position: 'absolute',
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                pointerEvents: 'none'
            }}>
                <span>💡</span>
                <span>Use o mouse para rotacionar a visualização 3D | Scroll para zoom</span>
            </div>
        </div>
    )
}

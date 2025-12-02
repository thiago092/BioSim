import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useState, useMemo } from 'react'
import type { ExperimentConfig, Offspring, ExperimentStatistics } from './types'
import { 
    AVAILABLE_GENES, 
    ALL_MENDEL_GENES,
    SEED_COLOR_GENE, 
    SEED_TEXTURE_GENE,
    FLOWER_COLOR_GENE,
    MENDEL_INFO
} from './data/sample-genes'
import { generateOffspring, createIndividual, calculateStatistics } from './utils/genetics-engine'
import { Chromosome } from './components/Chromosome'
import { DNAStrand } from './components/DNAStrand'
import { ControlPanel } from './components/ControlPanel'
import { OffspringList } from './components/OffspringList'
import { StatisticsPanel } from './components/StatisticsPanel'
import { TutorialPanel } from './components/TutorialPanel'
import { GlossaryPanel } from './components/GlossaryPanel'
import { PunnettSquare } from './components/PunnettSquare'
import { PeaGrid } from './components/PeaVisualization'
import { ChevronDown, ChevronUp, Grid3X3, Sprout, BookOpen, Settings2 } from 'lucide-react'

export function GeneticsSimulator() {
    const [showTutorial, setShowTutorial] = useState(true)
    const [genesLegendMinimized, setGenesLegendMinimized] = useState(false)
    const [showPunnett, setShowPunnett] = useState(false)
    const [selectedGeneForPunnett, setSelectedGeneForPunnett] = useState(SEED_COLOR_GENE)
    const [showPeaView, setShowPeaView] = useState(true)
    const [activeGenes, setActiveGenes] = useState(AVAILABLE_GENES)
    const [showMendelInfo, setShowMendelInfo] = useState(false)

    // Configuração inicial do experimento
    const [config, setConfig] = useState<ExperimentConfig>({
        numOffspring: 20,
        recombinationRate: 10,
        mutationRate: 0,
        parentalAlleles: {
            maternal: new Map([
                [SEED_COLOR_GENE.id, 'Y'],
                [SEED_TEXTURE_GENE.id, 'R'],
                [FLOWER_COLOR_GENE.id, 'P'],
            ]),
            paternal: new Map([
                [SEED_COLOR_GENE.id, 'y'],
                [SEED_TEXTURE_GENE.id, 'r'],
                [FLOWER_COLOR_GENE.id, 'p'],
            ]),
        }
    })

    const [offspring, setOffspring] = useState<Offspring[]>([])
    const [statistics, setStatistics] = useState<ExperimentStatistics | null>(null)
    const [generation, setGeneration] = useState(0)

    // Cria indivíduos parentais baseado na configuração
    const parents = useMemo(() => {
        const parent1 = createIndividual(
            config.parentalAlleles.maternal,
            config.parentalAlleles.maternal
        )
        const parent2 = createIndividual(
            config.parentalAlleles.paternal,
            config.parentalAlleles.paternal
        )
        return { parent1, parent2 }
    }, [config.parentalAlleles])

    // Gera descendentes
    const handleGenerate = () => {
        const newOffspring: Offspring[] = []

        for (let i = 0; i < config.numOffspring; i++) {
            const child = generateOffspring(
                parents.parent1,
                parents.parent2,
                config,
                activeGenes,
                generation + 1
            )
            newOffspring.push(child)
        }

        const newStats = calculateStatistics(newOffspring, activeGenes)
        setOffspring(newOffspring)
        setStatistics(newStats)
        setGeneration(prev => prev + 1)
    }

    // Reseta experimento
    const handleReset = () => {
        setOffspring([])
        setStatistics(null)
        setGeneration(0)
    }

    // Alterna genes ativos
    const toggleGeneSet = (useAll: boolean) => {
        const newGenes = useAll ? ALL_MENDEL_GENES : AVAILABLE_GENES
        setActiveGenes(newGenes)
        
        // Atualiza configuração com alelos dos novos genes
        const newMaternal = new Map<string, string>()
        const newPaternal = new Map<string, string>()
        
        newGenes.forEach(gene => {
            newMaternal.set(gene.id, gene.alleles[0].symbol)
            newPaternal.set(gene.id, gene.alleles[1].symbol)
        })
        
        setConfig(prev => ({
            ...prev,
            parentalAlleles: {
                maternal: newMaternal,
                paternal: newPaternal
            }
        }))
        
        handleReset()
    }

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#0a0a0f' }}>
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <color attach="background" args={['#0a0a0f']} />
                <Suspense fallback={null}>
                    <Environment preset="studio" />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                    {/* Luzes */}
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4488ff" />

                    {/* DNA Decorativo ao fundo */}
                    <group position={[0, 0, -3]} scale={0.5}>
                        <DNAStrand />
                    </group>

                    {/* Cromossomos Parentais */}
                    <Chromosome
                        chromosome={parents.parent1.maternal}
                        genes={activeGenes}
                        position={[-2.5, 3, 0]}
                    />

                    <Chromosome
                        chromosome={parents.parent2.paternal}
                        genes={activeGenes}
                        position={[2.5, 3, 0]}
                    />

                    {/* Linha divisória visual */}
                    <mesh position={[0, 0, 0]} scale={[0.02, 3, 0.02]}>
                        <boxGeometry />
                        <meshBasicMaterial color="rgba(255, 255, 255, 0.2)" transparent opacity={0.3} />
                    </mesh>

                    <OrbitControls
                        makeDefault
                        enablePan={true}
                        enableZoom={true}
                        enableRotate={true}
                        minDistance={5}
                        maxDistance={15}
                    />

                    <EffectComposer>
                        <Bloom
                            luminanceThreshold={0.3}
                            luminanceSmoothing={0.9}
                            height={300}
                            intensity={0.6}
                        />
                    </EffectComposer>
                </Suspense>
            </Canvas>

            {/* Header */}
            <div style={{
                position: 'absolute',
                top: '30px',
                left: '30px',
                color: 'white',
                pointerEvents: 'none',
            }}>
                <h1 style={{
                    margin: 0,
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    letterSpacing: '-0.02em',
                    background: 'linear-gradient(to right, #f093fb, #f5576c)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    BioSim
                </h1>
                <p style={{
                    margin: '5px 0 0 0',
                    opacity: 0.6,
                    fontSize: '1rem',
                    fontWeight: 500,
                }}>
                    Genética Mendeliana 3D
                </p>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '8px',
                    fontSize: '0.85rem',
                    opacity: 0.7
                }}>
                    <Sprout size={16} />
                    <span>Experimentos com Ervilhas</span>
                </div>
            </div>

            {/* Info do Professor */}
            <div style={{
                position: 'absolute',
                top: '30px',
                right: '30px',
                color: 'white',
                pointerEvents: 'none',
                textAlign: 'right',
            }}>
                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', opacity: 0.9 }}>
                    Aula Professora
                </p>
                <p style={{
                    margin: '2px 0',
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    background: 'linear-gradient(to right, #4488ff, #00ffff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Anayram Martins
                </p>
                <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', opacity: 0.7 }}>
                    📱 @anayrammartins
                </p>
            </div>

            {/* Painel de Controles */}
            <ControlPanel
                config={config}
                onConfigChange={setConfig}
                onGenerate={handleGenerate}
                onReset={handleReset}
                genes={activeGenes}
            />

            {/* Painel de Estatísticas */}
            <StatisticsPanel statistics={statistics} genes={activeGenes} />

            {/* Lista de Descendentes ou Visualização de Ervilhas */}
            {showPeaView && offspring.length > 0 ? (
                <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '30px',
                    width: 'calc(100% - 400px)',
                    maxHeight: '280px',
                    background: 'rgba(15, 15, 20, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    color: 'white',
                    overflowY: 'auto',
                }}>
                    <div style={{
                        padding: '16px 20px',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Sprout size={20} color="#22c55e" />
                            Ervilhas Geradas ({offspring.length})
                        </h3>
                        <button
                            onClick={() => setShowPeaView(false)}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                            }}
                        >
                            Ver Tabela
                        </button>
                    </div>
                    <PeaGrid offspring={offspring} genes={activeGenes} maxDisplay={30} />
                </div>
            ) : (
                <div style={{ position: 'relative' }}>
                    <OffspringList offspring={offspring} genes={activeGenes} />
                    {offspring.length > 0 && (
                        <button
                            onClick={() => setShowPeaView(true)}
                            style={{
                                position: 'absolute',
                                bottom: '50px',
                                left: '50px',
                                background: 'rgba(34, 197, 94, 0.2)',
                                border: '1px solid rgba(34, 197, 94, 0.4)',
                                borderRadius: '8px',
                                padding: '8px 14px',
                                color: '#22c55e',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <Sprout size={16} />
                            Ver Ervilhas
                        </button>
                    )}
                </div>
            )}

            {/* Barra de ferramentas inferior */}
            <div style={{
                position: 'absolute',
                bottom: '320px',
                left: '30px',
                display: 'flex',
                gap: '12px',
                flexDirection: 'column'
            }}>
                {/* Botão Quadro de Punnett */}
                <button
                    onClick={() => setShowPunnett(!showPunnett)}
                    style={{
                        background: showPunnett 
                            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(99, 102, 241, 0.1))'
                            : 'rgba(15, 15, 20, 0.95)',
                        border: showPunnett ? '2px solid rgba(99, 102, 241, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        backdropFilter: 'blur(20px)',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <Grid3X3 size={18} color="#6366f1" />
                    Quadro de Punnett
                </button>

                {/* Botão sobre Mendel */}
                <button
                    onClick={() => setShowMendelInfo(!showMendelInfo)}
                    style={{
                        background: showMendelInfo 
                            ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(251, 191, 36, 0.1))'
                            : 'rgba(15, 15, 20, 0.95)',
                        border: showMendelInfo ? '2px solid rgba(251, 191, 36, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        backdropFilter: 'blur(20px)',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <BookOpen size={18} color="#fbbf24" />
                    Sobre Mendel
                </button>

                {/* Seletor de genes */}
                <div style={{
                    background: 'rgba(15, 15, 20, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: 'white',
                }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        marginBottom: '10px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                    }}>
                        <Settings2 size={16} />
                        Genes Ativos
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => toggleGeneSet(false)}
                            style={{
                                flex: 1,
                                padding: '8px',
                                borderRadius: '8px',
                                border: 'none',
                                background: activeGenes.length === 3 ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255,255,255,0.1)',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: activeGenes.length === 3 ? '700' : '400'
                            }}
                        >
                            3 Básicos
                        </button>
                        <button
                            onClick={() => toggleGeneSet(true)}
                            style={{
                                flex: 1,
                                padding: '8px',
                                borderRadius: '8px',
                                border: 'none',
                                background: activeGenes.length === 7 ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255,255,255,0.1)',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: activeGenes.length === 7 ? '700' : '400'
                            }}
                        >
                            Todos (7)
                        </button>
                    </div>
                </div>
            </div>

            {/* Legenda de Genes */}
            <div style={{
                position: 'absolute',
                bottom: '320px',
                right: '360px',
                background: 'rgba(15, 15, 20, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: genesLegendMinimized ? '12px' : '16px',
                color: 'white',
                zIndex: 50,
                transition: 'all 0.3s ease',
                maxHeight: genesLegendMinimized ? 'auto' : '200px',
                overflowY: 'auto'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: genesLegendMinimized ? 0 : '12px',
                }}>
                    <div style={{
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        color: 'rgba(255, 255, 255, 0.9)',
                    }}>
                        🧬 Genes ({activeGenes.length})
                    </div>
                    <button
                        onClick={() => setGenesLegendMinimized(!genesLegendMinimized)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px',
                            cursor: 'pointer',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {genesLegendMinimized ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                    </button>
                </div>

                {!genesLegendMinimized && activeGenes.map(gene => (
                    <div 
                        key={gene.id} 
                        style={{ marginBottom: '10px', fontSize: '0.8rem' }}
                        onClick={() => {
                            setSelectedGeneForPunnett(gene)
                            setShowPunnett(true)
                        }}
                    >
                        <div style={{ 
                            fontWeight: '600', 
                            marginBottom: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: gene.alleles[0].color
                            }} />
                            {gene.name}
                        </div>
                        <div style={{ display: 'flex', gap: '12px', paddingLeft: '14px' }}>
                            {gene.alleles.map(allele => (
                                <div key={allele.symbol} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ color: allele.color, fontWeight: '700', fontFamily: 'monospace' }}>
                                        {allele.symbol}
                                    </span>
                                    <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem' }}>
                                        {allele.name}
                                    </span>
                                    {allele.isDominant && (
                                        <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>●</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quadro de Punnett Modal */}
            {showPunnett && (
                <>
                    {/* Overlay para bloquear interações */}
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1999,
                    }} onClick={() => setShowPunnett(false)} />
                    <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2000
                    }}>
                    <PunnettSquare
                        gene={selectedGeneForPunnett}
                        maternalAllele1={config.parentalAlleles.maternal.get(selectedGeneForPunnett.id) || selectedGeneForPunnett.alleles[0].symbol}
                        maternalAllele2={config.parentalAlleles.maternal.get(selectedGeneForPunnett.id) || selectedGeneForPunnett.alleles[0].symbol}
                        paternalAllele1={config.parentalAlleles.paternal.get(selectedGeneForPunnett.id) || selectedGeneForPunnett.alleles[1].symbol}
                        paternalAllele2={config.parentalAlleles.paternal.get(selectedGeneForPunnett.id) || selectedGeneForPunnett.alleles[1].symbol}
                        onClose={() => setShowPunnett(false)}
                    />
                    {/* Seletor de gene para Punnett */}
                    <div style={{
                        marginTop: '12px',
                        background: 'rgba(15, 15, 25, 0.98)',
                        borderRadius: '12px',
                        padding: '12px',
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        {activeGenes.map(gene => (
                            <button
                                key={gene.id}
                                onClick={() => setSelectedGeneForPunnett(gene)}
                                style={{
                                    padding: '8px 14px',
                                    borderRadius: '8px',
                                    border: selectedGeneForPunnett.id === gene.id 
                                        ? `2px solid ${gene.alleles[0].color}`
                                        : '1px solid rgba(255,255,255,0.2)',
                                    background: selectedGeneForPunnett.id === gene.id
                                        ? `${gene.alleles[0].color}30`
                                        : 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: gene.alleles[0].color
                                }} />
                                {gene.name}
                            </button>
                        ))}
                    </div>
                </div>
                </>
            )}

            {/* Info sobre Mendel */}
            {showMendelInfo && (
                <>
                    {/* Overlay para bloquear interações */}
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1999,
                    }} onClick={() => setShowMendelInfo(false)} />
                    <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(15, 15, 25, 0.98)',
                        backdropFilter: 'blur(20px)',
                        border: '2px solid rgba(251, 191, 36, 0.4)',
                        borderRadius: '20px',
                        padding: '28px',
                        color: 'white',
                        zIndex: 2000,
                        maxWidth: '500px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                        <div>
                            <h2 style={{ 
                                margin: 0, 
                                fontSize: '1.5rem', 
                                fontWeight: '800',
                                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                🔬 Gregor Johann Mendel
                            </h2>
                            <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                                O Pai da Genética (1822-1884)
                            </p>
                        </div>
                        <button
                            onClick={() => setShowMendelInfo(false)}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    <div style={{ display: 'grid', gap: '12px' }}>
                        {Object.entries(MENDEL_INFO).map(([key, value]) => (
                            <div key={key} style={{
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '10px',
                                padding: '12px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <span style={{ fontSize: '1.2rem' }}>
                                    {key === 'period' ? '📅' : 
                                     key === 'location' ? '📍' :
                                     key === 'totalPlants' ? '🌱' :
                                     key === 'generations' ? '🔄' :
                                     key === 'publication' ? '📜' : '🎯'}
                                </span>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>
                                        {key.replace(/([A-Z])/g, ' $1')}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        marginTop: '20px',
                        padding: '14px',
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))',
                        borderRadius: '12px',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        fontSize: '0.85rem',
                        lineHeight: '1.6'
                    }}>
                        <strong style={{ color: '#22c55e' }}>🧬 Leis de Mendel:</strong>
                        <div style={{ marginTop: '8px' }}>
                            <div><strong>1ª Lei (Segregação):</strong> Os fatores (genes) se separam na formação dos gametas.</div>
                            <div style={{ marginTop: '4px' }}><strong>2ª Lei (Distribuição Independente):</strong> Genes em cromossomos diferentes segregam independentemente.</div>
                        </div>
                    </div>
                </div>
                </>
            )}

            {/* Tutorial Interativo */}
            {showTutorial && (
                <TutorialPanel onComplete={() => setShowTutorial(false)} />
            )}

            {/* Glossário Flutuante */}
            <GlossaryPanel />

            {/* Indicador de Geração */}
            {generation > 0 && (
                <div style={{
                    position: 'absolute',
                    top: '100px',
                    left: '50%',
                    transform: 'translateX(-50)',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3))',
                    border: '2px solid rgba(99, 102, 241, 0.5)',
                    borderRadius: '30px',
                    padding: '10px 24px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: '700',
                    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)'
                }}>
                    <span style={{ fontSize: '1.2rem' }}>🧬</span>
                    <span>Geração F{generation}</span>
                    <span style={{ 
                        background: 'rgba(255,255,255,0.2)', 
                        borderRadius: '20px', 
                        padding: '2px 10px',
                        fontSize: '0.8rem'
                    }}>
                        {offspring.length} descendentes
                    </span>
                </div>
            )}
        </div>
    )
}

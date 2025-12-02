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
import { ChevronDown, ChevronUp, Grid3X3, Sprout, BookOpen, Settings2, Home, X } from 'lucide-react'
import { Link } from 'react-router-dom'

export function GeneticsSimulator() {
    const [showTutorial, setShowTutorial] = useState(true)
    const [genesLegendMinimized, setGenesLegendMinimized] = useState(true)
    const [showPunnett, setShowPunnett] = useState(false)
    const [selectedGeneForPunnett, setSelectedGeneForPunnett] = useState(SEED_COLOR_GENE)
    const [showPeaView, setShowPeaView] = useState(true)
    const [activeGenes, setActiveGenes] = useState(AVAILABLE_GENES)
    const [showMendelInfo, setShowMendelInfo] = useState(false)

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

    const parents = useMemo(() => {
        const parent1 = createIndividual(config.parentalAlleles.maternal, config.parentalAlleles.maternal)
        const parent2 = createIndividual(config.parentalAlleles.paternal, config.parentalAlleles.paternal)
        return { parent1, parent2 }
    }, [config.parentalAlleles])

    const handleGenerate = () => {
        const newOffspring: Offspring[] = []
        for (let i = 0; i < config.numOffspring; i++) {
            const child = generateOffspring(parents.parent1, parents.parent2, config, activeGenes, generation + 1)
            newOffspring.push(child)
        }
        const newStats = calculateStatistics(newOffspring, activeGenes)
        setOffspring(newOffspring)
        setStatistics(newStats)
        setGeneration(prev => prev + 1)
    }

    const handleReset = () => {
        setOffspring([])
        setStatistics(null)
        setGeneration(0)
    }

    const toggleGeneSet = (useAll: boolean) => {
        const newGenes = useAll ? ALL_MENDEL_GENES : AVAILABLE_GENES
        setActiveGenes(newGenes)
        const newMaternal = new Map<string, string>()
        const newPaternal = new Map<string, string>()
        newGenes.forEach(gene => {
            newMaternal.set(gene.id, gene.alleles[0].symbol)
            newPaternal.set(gene.id, gene.alleles[1].symbol)
        })
        setConfig(prev => ({ ...prev, parentalAlleles: { maternal: newMaternal, paternal: newPaternal } }))
        handleReset()
    }

    return (
        <div className="gen-sim">
            <style>{`
                .gen-sim {
                    width: 100vw;
                    height: 100vh;
                    background: #0a0a0f;
                    overflow: hidden;
                    position: relative;
                }
                .gen-sim .ui-overlay {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    padding: 0.6rem;
                    display: flex;
                    flex-direction: column;
                }
                .gen-sim .top-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    pointer-events: auto;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }
                .gen-sim .left-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: white;
                }
                .gen-sim .icon-btn {
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
                .gen-sim .icon-btn:hover {
                    background: rgba(68,136,255,0.3);
                }
                .gen-sim .title {
                    font-size: 1rem;
                    font-weight: 800;
                    background: linear-gradient(to right, #f093fb, #f5576c);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .gen-sim .subtitle {
                    font-size: 0.55rem;
                    opacity: 0.5;
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }
                .gen-sim .right-info {
                    text-align: right;
                    color: white;
                    pointer-events: none;
                }
                .gen-sim .prof-label {
                    font-size: 0.6rem;
                    opacity: 0.7;
                }
                .gen-sim .prof-name {
                    font-size: 0.8rem;
                    font-weight: 700;
                    background: linear-gradient(to right, #4488ff, #00ffff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .gen-sim .prof-social {
                    font-size: 0.55rem;
                    opacity: 0.6;
                }
                .gen-sim .generation-badge {
                    position: absolute;
                    top: 3.5rem;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.3));
                    border: 1px solid rgba(99,102,241,0.5);
                    border-radius: 1rem;
                    padding: 0.4rem 0.8rem;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.7rem;
                    font-weight: 600;
                    pointer-events: none;
                }
                .gen-sim .generation-badge .count {
                    background: rgba(255,255,255,0.2);
                    border-radius: 0.5rem;
                    padding: 0.1rem 0.4rem;
                    font-size: 0.6rem;
                }
                .gen-sim .bottom-section {
                    position: absolute;
                    bottom: 0.6rem;
                    left: 0.6rem;
                    right: 0.6rem;
                    display: flex;
                    gap: 0.5rem;
                    pointer-events: auto;
                }
                .gen-sim .left-tools {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                }
                .gen-sim .tool-btn {
                    background: rgba(15,15,20,0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 0.5rem;
                    padding: 0.5rem 0.6rem;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.65rem;
                    font-weight: 600;
                }
                .gen-sim .tool-btn.active {
                    border-color: rgba(99,102,241,0.5);
                    background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.05));
                }
                .gen-sim .tool-btn.mendel {
                    border-color: rgba(251,191,36,0.3);
                }
                .gen-sim .tool-btn.mendel.active {
                    border-color: rgba(251,191,36,0.5);
                    background: linear-gradient(135deg, rgba(251,191,36,0.2), rgba(251,191,36,0.05));
                }
                .gen-sim .genes-box {
                    background: rgba(15,15,20,0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 0.5rem;
                    padding: 0.5rem;
                    color: white;
                }
                .gen-sim .genes-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.7rem;
                    font-weight: 600;
                    margin-bottom: 0.4rem;
                }
                .gen-sim .genes-toggle {
                    display: flex;
                    gap: 0.3rem;
                }
                .gen-sim .genes-toggle button {
                    flex: 1;
                    padding: 0.3rem 0.5rem;
                    border-radius: 0.3rem;
                    border: none;
                    background: rgba(255,255,255,0.1);
                    color: white;
                    cursor: pointer;
                    font-size: 0.6rem;
                }
                .gen-sim .genes-toggle button.active {
                    background: rgba(99,102,241,0.3);
                    font-weight: 700;
                }
                .gen-sim .center-area {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                    max-height: 12rem;
                    overflow: hidden;
                }
                .gen-sim .pea-container {
                    background: rgba(15,15,20,0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 0.6rem;
                    overflow: hidden;
                    flex: 1;
                }
                .gen-sim .pea-header {
                    padding: 0.5rem 0.6rem;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: white;
                    font-size: 0.7rem;
                    font-weight: 600;
                }
                .gen-sim .pea-header button {
                    background: rgba(255,255,255,0.1);
                    border: none;
                    border-radius: 0.3rem;
                    padding: 0.25rem 0.5rem;
                    color: white;
                    cursor: pointer;
                    font-size: 0.55rem;
                }
                .gen-sim .right-panel {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                    max-width: 10rem;
                }
                .gen-sim .legend-box {
                    background: rgba(15,15,20,0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 0.5rem;
                    padding: 0.5rem;
                    color: white;
                    max-height: 10rem;
                    overflow-y: auto;
                }
                .gen-sim .legend-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.7rem;
                    font-weight: 600;
                    margin-bottom: 0.4rem;
                }
                .gen-sim .legend-header button {
                    background: rgba(255,255,255,0.1);
                    border: none;
                    border-radius: 0.3rem;
                    padding: 0.2rem;
                    cursor: pointer;
                    color: white;
                    display: flex;
                    align-items: center;
                }
                .gen-sim .gene-item {
                    margin-bottom: 0.5rem;
                    font-size: 0.6rem;
                    cursor: pointer;
                }
                .gen-sim .gene-name {
                    font-weight: 600;
                    margin-bottom: 0.15rem;
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }
                .gen-sim .gene-dot {
                    width: 0.4rem;
                    height: 0.4rem;
                    border-radius: 50%;
                }
                .gen-sim .alleles {
                    display: flex;
                    gap: 0.5rem;
                    padding-left: 0.7rem;
                    font-size: 0.55rem;
                }
                .gen-sim .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 100;
                    padding: 0.5rem;
                }
                .gen-sim .modal {
                    background: rgba(15,15,25,0.98);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(251,191,36,0.4);
                    border-radius: 0.75rem;
                    padding: 1rem;
                    color: white;
                    max-width: 22rem;
                    width: 100%;
                    max-height: 80vh;
                    overflow: auto;
                }
                .gen-sim .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 0.75rem;
                }
                .gen-sim .modal-title {
                    font-size: 1rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #fbbf24, #f59e0b);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin: 0;
                }
                .gen-sim .modal-subtitle {
                    font-size: 0.65rem;
                    color: rgba(255,255,255,0.7);
                    margin-top: 0.15rem;
                }
                .gen-sim .info-grid {
                    display: grid;
                    gap: 0.5rem;
                }
                .gen-sim .info-item {
                    background: rgba(255,255,255,0.05);
                    border-radius: 0.5rem;
                    padding: 0.5rem 0.6rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.65rem;
                }
                .gen-sim .info-item .icon {
                    font-size: 0.9rem;
                }
                .gen-sim .info-item .label {
                    font-size: 0.5rem;
                    color: rgba(255,255,255,0.5);
                    text-transform: capitalize;
                }
                .gen-sim .info-item .value {
                    font-weight: 600;
                }
                .gen-sim .laws-box {
                    margin-top: 0.75rem;
                    padding: 0.6rem;
                    background: linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05));
                    border-radius: 0.5rem;
                    border: 1px solid rgba(34,197,94,0.3);
                    font-size: 0.6rem;
                    line-height: 1.5;
                }
                .gen-sim .laws-box strong {
                    color: #22c55e;
                }
                .gen-sim .punnett-modal {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 101;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .gen-sim .gene-selector {
                    background: rgba(15,15,25,0.98);
                    border-radius: 0.5rem;
                    padding: 0.5rem;
                    display: flex;
                    gap: 0.3rem;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .gen-sim .gene-selector button {
                    padding: 0.4rem 0.6rem;
                    border-radius: 0.4rem;
                    border: 1px solid rgba(255,255,255,0.2);
                    background: rgba(255,255,255,0.05);
                    color: white;
                    cursor: pointer;
                    font-size: 0.6rem;
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }
                .gen-sim .gene-selector button.selected {
                    border-width: 2px;
                }
                @media (max-width: 900px) {
                    .gen-sim .right-panel { display: none; }
                    .gen-sim .center-area { max-height: 10rem; }
                }
                @media (max-width: 600px) {
                    .gen-sim .left-tools { flex-direction: row; flex-wrap: wrap; }
                    .gen-sim .center-area { max-height: 8rem; }
                }
            `}</style>

            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <color attach="background" args={['#0a0a0f']} />
                <Suspense fallback={null}>
                    <Environment preset="studio" />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4488ff" />

                    <group position={[0, 0, -3]} scale={0.5}>
                        <DNAStrand />
                    </group>

                    <Chromosome chromosome={parents.parent1.maternal} genes={activeGenes} position={[-2.5, 3, 0]} />
                    <Chromosome chromosome={parents.parent2.paternal} genes={activeGenes} position={[2.5, 3, 0]} />

                    <mesh position={[0, 0, 0]} scale={[0.02, 3, 0.02]}>
                        <boxGeometry />
                        <meshBasicMaterial color="rgba(255,255,255,0.2)" transparent opacity={0.3} />
                    </mesh>

                    <OrbitControls makeDefault enablePan enableZoom enableRotate minDistance={5} maxDistance={15} />
                    <EffectComposer><Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} intensity={0.6} /></EffectComposer>
                </Suspense>
            </Canvas>

            <div className="ui-overlay">
                <div className="top-bar">
                    <div className="left-header">
                        <Link to="/" className="icon-btn"><Home size={14} /></Link>
                        <div>
                            <div className="title">BioSim</div>
                            <div className="subtitle"><Sprout size={12} /> Genética Mendeliana</div>
                        </div>
                    </div>
                    <div className="right-info">
                        <div className="prof-label">Aula Professora</div>
                        <div className="prof-name">Anayram Martins</div>
                        <div className="prof-social">📱 @anayrammartins</div>
                    </div>
                </div>

                {generation > 0 && (
                    <div className="generation-badge">
                        <span>🧬</span>
                        <span>Geração F{generation}</span>
                        <span className="count">{offspring.length} descendentes</span>
                    </div>
                )}

                <div className="bottom-section">
                    <div className="left-tools">
                        <button className={`tool-btn ${showPunnett ? 'active' : ''}`} onClick={() => setShowPunnett(!showPunnett)}>
                            <Grid3X3 size={14} color="#6366f1" /> Punnett
                        </button>
                        <button className={`tool-btn mendel ${showMendelInfo ? 'active' : ''}`} onClick={() => setShowMendelInfo(!showMendelInfo)}>
                            <BookOpen size={14} color="#fbbf24" /> Mendel
                        </button>
                        <div className="genes-box">
                            <div className="genes-header">
                                <span><Settings2 size={12} /> Genes</span>
                            </div>
                            <div className="genes-toggle">
                                <button className={activeGenes.length === 3 ? 'active' : ''} onClick={() => toggleGeneSet(false)}>3</button>
                                <button className={activeGenes.length === 7 ? 'active' : ''} onClick={() => toggleGeneSet(true)}>7</button>
                            </div>
                        </div>
                    </div>

                    <div className="center-area">
                        {showPeaView && offspring.length > 0 ? (
                            <div className="pea-container">
                                <div className="pea-header">
                                    <span><Sprout size={14} color="#22c55e" /> Ervilhas ({offspring.length})</span>
                                    <button onClick={() => setShowPeaView(false)}>Tabela</button>
                                </div>
                                <PeaGrid offspring={offspring} genes={activeGenes} maxDisplay={30} />
                            </div>
                        ) : (
                            <div style={{ position: 'relative' }}>
                                <OffspringList offspring={offspring} genes={activeGenes} />
                                {offspring.length > 0 && (
                                    <button className="tool-btn" onClick={() => setShowPeaView(true)} style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem' }}>
                                        <Sprout size={12} /> Ervilhas
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="right-panel">
                        <div className="legend-box">
                            <div className="legend-header">
                                <span>🧬 Genes ({activeGenes.length})</span>
                                <button onClick={() => setGenesLegendMinimized(!genesLegendMinimized)}>
                                    {genesLegendMinimized ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                                </button>
                            </div>
                            {!genesLegendMinimized && activeGenes.map(gene => (
                                <div key={gene.id} className="gene-item" onClick={() => { setSelectedGeneForPunnett(gene); setShowPunnett(true) }}>
                                    <div className="gene-name">
                                        <div className="gene-dot" style={{ background: gene.alleles[0].color }} />
                                        {gene.name}
                                    </div>
                                    <div className="alleles">
                                        {gene.alleles.map(a => (
                                            <span key={a.symbol}>
                                                <span style={{ color: a.color, fontWeight: 700, fontFamily: 'monospace' }}>{a.symbol}</span>
                                                {' '}<span style={{ opacity: 0.6 }}>{a.name}</span>
                                                {a.isDominant && <span style={{ opacity: 0.5 }}> ●</span>}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <ControlPanel config={config} onConfigChange={setConfig} onGenerate={handleGenerate} onReset={handleReset} genes={activeGenes} />
            <StatisticsPanel statistics={statistics} genes={activeGenes} />

            {showPunnett && (
                <>
                    <div className="modal-overlay" onClick={() => setShowPunnett(false)} />
                    <div className="punnett-modal">
                        <PunnettSquare
                            gene={selectedGeneForPunnett}
                            maternalAllele1={config.parentalAlleles.maternal.get(selectedGeneForPunnett.id) || selectedGeneForPunnett.alleles[0].symbol}
                            maternalAllele2={config.parentalAlleles.maternal.get(selectedGeneForPunnett.id) || selectedGeneForPunnett.alleles[0].symbol}
                            paternalAllele1={config.parentalAlleles.paternal.get(selectedGeneForPunnett.id) || selectedGeneForPunnett.alleles[1].symbol}
                            paternalAllele2={config.parentalAlleles.paternal.get(selectedGeneForPunnett.id) || selectedGeneForPunnett.alleles[1].symbol}
                            onClose={() => setShowPunnett(false)}
                        />
                        <div className="gene-selector">
                            {activeGenes.map(gene => (
                                <button
                                    key={gene.id}
                                    onClick={() => setSelectedGeneForPunnett(gene)}
                                    className={selectedGeneForPunnett.id === gene.id ? 'selected' : ''}
                                    style={{ borderColor: selectedGeneForPunnett.id === gene.id ? gene.alleles[0].color : undefined, background: selectedGeneForPunnett.id === gene.id ? `${gene.alleles[0].color}30` : undefined }}
                                >
                                    <div className="gene-dot" style={{ background: gene.alleles[0].color, width: '0.4rem', height: '0.4rem', borderRadius: '50%' }} />
                                    {gene.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {showMendelInfo && (
                <div className="modal-overlay" onClick={() => setShowMendelInfo(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h2 className="modal-title">🔬 Gregor Johann Mendel</h2>
                                <p className="modal-subtitle">O Pai da Genética (1822-1884)</p>
                            </div>
                            <button className="icon-btn" onClick={() => setShowMendelInfo(false)}><X size={14} /></button>
                        </div>
                        <div className="info-grid">
                            {Object.entries(MENDEL_INFO).map(([key, value]) => (
                                <div key={key} className="info-item">
                                    <span className="icon">
                                        {key === 'period' ? '📅' : key === 'location' ? '📍' : key === 'totalPlants' ? '🌱' : key === 'generations' ? '🔄' : key === 'publication' ? '📜' : '🎯'}
                                    </span>
                                    <div>
                                        <div className="label">{key.replace(/([A-Z])/g, ' $1')}</div>
                                        <div className="value">{value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="laws-box">
                            <strong>🧬 Leis de Mendel:</strong>
                            <div style={{ marginTop: '0.4rem' }}>
                                <div><strong>1ª Lei (Segregação):</strong> Os fatores (genes) se separam na formação dos gametas.</div>
                                <div style={{ marginTop: '0.2rem' }}><strong>2ª Lei (Distribuição Independente):</strong> Genes em cromossomos diferentes segregam independentemente.</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showTutorial && <TutorialPanel onComplete={() => setShowTutorial(false)} />}
            <GlossaryPanel />
        </div>
    )
}

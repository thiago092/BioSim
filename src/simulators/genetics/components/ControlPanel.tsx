import type { ExperimentConfig, Gene } from '../types'
import { Sliders, TestTubes, Dna, RotateCcw } from 'lucide-react'

interface ControlPanelProps {
    config: ExperimentConfig
    onConfigChange: (config: ExperimentConfig) => void
    onGenerate: () => void
    onReset: () => void
    genes: Gene[]
}

export function ControlPanel({ config, onConfigChange, onGenerate, onReset, genes }: ControlPanelProps) {
    const updateConfig = (updates: Partial<ExperimentConfig>) => {
        onConfigChange({ ...config, ...updates })
    }

    return (
        <div style={{
            position: 'absolute',
            top: '100px',
            right: '30px',
            width: '320px',
            background: 'rgba(15, 15, 20, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            color: 'white',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            maxHeight: 'calc(100vh - 140px)',
            overflowY: 'auto',
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px',
            }}>
                <Sliders size={20} color="#4488ff" />
                <h2 style={{
                    margin: 0,
                    fontSize: '1.3rem',
                    fontWeight: '700',
                }}>
                    Controles Experimentais
                </h2>
            </div>

            {/* Número de Descendentes */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: 'rgba(255, 255, 255, 0.9)',
                }}>
                    <TestTubes size={14} style={{ display: 'inline', marginRight: '6px' }} />
                    Descendentes: {config.numOffspring}
                </label>
                <input
                    type="range"
                    min="1"
                    max="100"
                    value={config.numOffspring}
                    onChange={(e) => updateConfig({ numOffspring: parseInt(e.target.value) })}
                    style={{
                        width: '100%',
                        accentColor: '#4488ff',
                    }}
                />
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginTop: '4px',
                }}>
                    <span>1</span>
                    <span>100</span>
                </div>
            </div>

            {/* Taxa de Recombinação */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: 'rgba(255, 255, 255, 0.9)',
                }}>
                    <Dna size={14} style={{ display: 'inline', marginRight: '6px' }} />
                    Recombinação: {config.recombinationRate}%
                </label>
                <input
                    type="range"
                    min="0"
                    max="50"
                    value={config.recombinationRate}
                    onChange={(e) => updateConfig({ recombinationRate: parseInt(e.target.value) })}
                    style={{
                        width: '100%',
                        accentColor: '#f093fb',
                    }}
                />
                <div style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginTop: '6px',
                }}>
                    Probabilidade de crossing-over durante meiose
                </div>
            </div>

            {/* Taxa de Mutação */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: 'rgba(255, 255, 255, 0.9)',
                }}>
                    ⚡ Mutação: {config.mutationRate}%
                </label>
                <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.5"
                    value={config.mutationRate}
                    onChange={(e) => updateConfig({ mutationRate: parseFloat(e.target.value) })}
                    style={{
                        width: '100%',
                        accentColor: '#fbbf24',
                    }}
                />
                <div style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginTop: '6px',
                }}>
                    Probabilidade de mutação espontânea
                </div>
            </div>

            <div style={{
                height: '1px',
                background: 'rgba(255, 255, 255, 0.1)',
                margin: '20px 0',
            }} />

            {/* Alelos Parentais */}
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    marginBottom: '12px',
                }}>
                    Alelos Parentais
                </h3>

                {genes.map(gene => (
                    <div key={gene.id} style={{ marginBottom: '16px' }}>
                        <div style={{
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            marginBottom: '8px',
                            color: 'rgba(255, 255, 255, 0.8)',
                        }}>
                            {gene.name}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            {/* Materno */}
                            <div>
                                <label style={{
                                    fontSize: '0.75rem',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    display: 'block',
                                    marginBottom: '4px',
                                }}>
                                    ♀️ Materno
                                </label>
                                <select
                                    value={config.parentalAlleles.maternal.get(gene.id) || gene.alleles[0].symbol}
                                    onChange={(e) => {
                                        const newMaternal = new Map(config.parentalAlleles.maternal)
                                        newMaternal.set(gene.id, e.target.value)
                                        updateConfig({
                                            parentalAlleles: {
                                                ...config.parentalAlleles,
                                                maternal: newMaternal
                                            }
                                        })
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '6px',
                                        borderRadius: '6px',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        color: 'white',
                                        fontSize: '0.85rem',
                                    }}
                                >
                                    {gene.alleles.map(allele => (
                                        <option key={allele.symbol} value={allele.symbol} style={{ background: '#1a1a2e' }}>
                                            {allele.symbol} - {allele.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Paterno */}
                            <div>
                                <label style={{
                                    fontSize: '0.75rem',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    display: 'block',
                                    marginBottom: '4px',
                                }}>
                                    ♂️ Paterno
                                </label>
                                <select
                                    value={config.parentalAlleles.paternal.get(gene.id) || gene.alleles[0].symbol}
                                    onChange={(e) => {
                                        const newPaternal = new Map(config.parentalAlleles.paternal)
                                        newPaternal.set(gene.id, e.target.value)
                                        updateConfig({
                                            parentalAlleles: {
                                                ...config.parentalAlleles,
                                                paternal: newPaternal
                                            }
                                        })
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '6px',
                                        borderRadius: '6px',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        color: 'white',
                                        fontSize: '0.85rem',
                                    }}
                                >
                                    {gene.alleles.map(allele => (
                                        <option key={allele.symbol} value={allele.symbol} style={{ background: '#1a1a2e' }}>
                                            {allele.symbol} - {allele.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Botões de Ação */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                    onClick={onGenerate}
                    style={{
                        padding: '14px',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #4488ff 0%, #00c9ff 100%)',
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(68, 136, 255, 0.4)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(68, 136, 255, 0.6)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(68, 136, 255, 0.4)'
                    }}
                >
                    🧬 Gerar Descendentes
                </button>

                <button
                    onClick={onReset}
                    style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    }}
                >
                    <RotateCcw size={16} />
                    Resetar Experimento
                </button>
            </div>
        </div>
    )
}

import { useState, useMemo } from 'react'
import type { ExperimentStatistics, Gene } from '../types'
import { BarChart3, TrendingUp, ChevronDown, ChevronUp, Calculator, FlaskConical } from 'lucide-react'
import { MENDEL_DATA } from '../data/sample-genes'

interface StatisticsPanelProps {
    statistics: ExperimentStatistics | null
    genes: Gene[]
}

// Calcula o Chi-Quadrado
function calculateChiSquare(observed: Map<string, number>, expectedRatio: number[]): {
    chiSquare: number
    degreesOfFreedom: number
    pValue: string
    significant: boolean
} {
    const total = Array.from(observed.values()).reduce((a, b) => a + b, 0)
    const totalRatio = expectedRatio.reduce((a, b) => a + b, 0)

    const observedValues = Array.from(observed.values())
    const expectedValues = expectedRatio.map(r => (r / totalRatio) * total)

    let chiSquare = 0
    for (let i = 0; i < observedValues.length; i++) {
        const diff = observedValues[i] - expectedValues[i]
        chiSquare += (diff * diff) / expectedValues[i]
    }

    const degreesOfFreedom = observedValues.length - 1

    // Valores críticos aproximados para p = 0.05
    const criticalValues: Record<number, number> = {
        1: 3.841,
        2: 5.991,
        3: 7.815
    }

    const critical = criticalValues[degreesOfFreedom] || 3.841
    const significant = chiSquare > critical

    // Determinação aproximada do p-value
    let pValue = 'p > 0.05'
    if (chiSquare > 10.828) pValue = 'p < 0.001'
    else if (chiSquare > 6.635) pValue = 'p < 0.01'
    else if (chiSquare > 3.841) pValue = 'p < 0.05'

    return { chiSquare, degreesOfFreedom, pValue, significant }
}

export function StatisticsPanel({ statistics, genes }: StatisticsPanelProps) {
    const [isMinimized, setIsMinimized] = useState(false)
    const [showChiSquare, setShowChiSquare] = useState(false)

    // Calcula estatísticas avançadas
    const advancedStats = useMemo(() => {
        if (!statistics) return null

        return statistics.geneStats.map(stat => {
            const chiResult = calculateChiSquare(stat.phenotypeFrequencies, [3, 1])
            return { ...stat, chi: chiResult }
        })
    }, [statistics])

    if (!statistics || statistics.totalOffspring === 0) {
        return null
    }

    // Mapeia geneId para dados históricos de Mendel
    const getMendelData = (geneId: string) => {
        const mapping: Record<string, keyof typeof MENDEL_DATA> = {
            'seed-color': 'seedColor',
            'seed-texture': 'seedShape',
            'flower-color': 'flowerColor',
            'flower-position': 'flowerPosition',
            'pod-color': 'podColor',
            'pod-shape': 'podShape',
            'plant-height': 'plantHeight'
        }
        return MENDEL_DATA[mapping[geneId]]
    }

    return (
        <div style={{
            position: 'absolute',
            top: '100px',
            left: '30px',
            width: '360px',
            background: 'rgba(15, 15, 20, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: isMinimized ? '16px' : '24px',
            color: 'white',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            maxHeight: isMinimized ? 'auto' : 'calc(100vh - 200px)',
            overflowY: isMinimized ? 'visible' : 'auto',
            transition: 'all 0.3s ease',
            zIndex: 100,
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: isMinimized ? 0 : '20px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <BarChart3 size={20} color="#4ade80" />
                    <h2 style={{
                        margin: 0,
                        fontSize: '1.3rem',
                        fontWeight: '700',
                    }}>
                        Estatísticas
                    </h2>
                </div>
                <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px',
                        cursor: 'pointer',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                    }}
                >
                    {isMinimized ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </button>
            </div>

            {!isMinimized && (
                <>
                    {/* Total de descendentes */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.2), rgba(74, 222, 128, 0.05))',
                        border: '1px solid rgba(74, 222, 128, 0.3)',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '20px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FlaskConical size={24} color="#4ade80" />
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Total de Descendentes
                                </div>
                                <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#4ade80' }}>
                                    {statistics.totalOffspring}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Toggle Chi-Quadrado */}
                    <button
                        onClick={() => setShowChiSquare(!showChiSquare)}
                        style={{
                            width: '100%',
                            padding: '10px 16px',
                            marginBottom: '16px',
                            background: showChiSquare 
                                ? 'linear-gradient(135deg, rgba(167, 139, 250, 0.3), rgba(167, 139, 250, 0.1))'
                                : 'rgba(255,255,255,0.05)',
                            border: showChiSquare ? '1px solid rgba(167, 139, 250, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '10px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <Calculator size={16} />
                        {showChiSquare ? 'Ocultar Chi-Quadrado (χ²)' : 'Mostrar Chi-Quadrado (χ²)'}
                    </button>

                    {advancedStats?.map(stat => {
                        const gene = genes.find(g => g.id === stat.geneId)
                        if (!gene) return null

                        const phenotypeEntries = Array.from(stat.phenotypeFrequencies.entries())
                        const total = statistics.totalOffspring
                        const mendelData = getMendelData(stat.geneId)

                        return (
                            <div key={stat.geneId} style={{ marginBottom: '24px' }}>
                                <h3 style={{
                                    fontSize: '1rem',
                                    fontWeight: '700',
                                    marginBottom: '12px',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <span style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: gene.alleles[0].color
                                    }} />
                                    {stat.geneName}
                                </h3>

                                {/* Barras de fenótipos */}
                                <div style={{ marginBottom: '12px' }}>
                                    {phenotypeEntries.map(([phenotype, count]) => {
                                        const percentage = ((count / total) * 100).toFixed(1)
                                        const allele = gene.alleles.find(a => a.name === phenotype)
                                        const color = allele?.color || '#888'

                                        return (
                                            <div key={phenotype} style={{ marginBottom: '10px' }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: '4px',
                                                    fontSize: '0.85rem',
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <div style={{
                                                            width: '12px',
                                                            height: '12px',
                                                            borderRadius: '3px',
                                                            background: color,
                                                            boxShadow: `0 0 8px ${color}50`
                                                        }} />
                                                        <span style={{ color }}>{phenotype}</span>
                                                        {allele?.isDominant && (
                                                            <span style={{ 
                                                                fontSize: '0.65rem', 
                                                                background: 'rgba(255,255,255,0.1)',
                                                                padding: '2px 5px',
                                                                borderRadius: '4px'
                                                            }}>
                                                                DOM
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span style={{ fontWeight: '700' }}>
                                                        {count} <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '400' }}>
                                                            ({percentage}%)
                                                        </span>
                                                    </span>
                                                </div>
                                                <div style={{
                                                    height: '10px',
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '5px',
                                                    overflow: 'hidden',
                                                }}>
                                                    <div style={{
                                                        height: '100%',
                                                        width: `${percentage}%`,
                                                        background: `linear-gradient(90deg, ${color}, ${color}aa)`,
                                                        transition: 'width 0.5s ease',
                                                        borderRadius: '5px'
                                                    }} />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Proporção esperada */}
                                <div style={{
                                    fontSize: '0.75rem',
                                    padding: '10px 12px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '8px',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <TrendingUp size={14} />
                                        Esperado (Mendel): {stat.expectedRatio || '3:1'}
                                    </div>
                                    {mendelData && (
                                        <span style={{ 
                                            color: '#fbbf24',
                                            fontWeight: '600'
                                        }}>
                                            Histórico: {mendelData.ratio}
                                        </span>
                                    )}
                                </div>

                                {/* Chi-Quadrado */}
                                {showChiSquare && stat.chi && (
                                    <div style={{
                                        marginTop: '10px',
                                        padding: '12px',
                                        background: stat.chi.significant 
                                            ? 'rgba(248, 113, 113, 0.1)' 
                                            : 'rgba(74, 222, 128, 0.1)',
                                        border: `1px solid ${stat.chi.significant ? 'rgba(248, 113, 113, 0.3)' : 'rgba(74, 222, 128, 0.3)'}`,
                                        borderRadius: '8px'
                                    }}>
                                        <div style={{ 
                                            fontSize: '0.8rem', 
                                            fontWeight: '600',
                                            marginBottom: '8px',
                                            color: stat.chi.significant ? '#f87171' : '#4ade80'
                                        }}>
                                            <Calculator size={14} style={{ display: 'inline', marginRight: '6px' }} />
                                            Teste Chi-Quadrado (χ²)
                                        </div>
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '8px',
                                            fontSize: '0.75rem'
                                        }}>
                                            <div>
                                                <span style={{ color: 'rgba(255,255,255,0.6)' }}>χ² = </span>
                                                <span style={{ fontWeight: '700', fontFamily: 'monospace' }}>
                                                    {stat.chi.chiSquare.toFixed(3)}
                                                </span>
                                            </div>
                                            <div>
                                                <span style={{ color: 'rgba(255,255,255,0.6)' }}>df = </span>
                                                <span style={{ fontWeight: '700' }}>{stat.chi.degreesOfFreedom}</span>
                                            </div>
                                            <div style={{ gridColumn: 'span 2' }}>
                                                <span style={{ color: 'rgba(255,255,255,0.6)' }}>p-valor: </span>
                                                <span style={{ 
                                                    fontWeight: '700',
                                                    color: stat.chi.significant ? '#f87171' : '#4ade80'
                                                }}>
                                                    {stat.chi.pValue}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{
                                            marginTop: '8px',
                                            fontSize: '0.7rem',
                                            color: 'rgba(255,255,255,0.5)',
                                            fontStyle: 'italic'
                                        }}>
                                            {stat.chi.significant 
                                                ? '⚠️ Diferença significativa - pode não seguir herança mendeliana'
                                                : '✓ Resultados compatíveis com proporção 3:1'
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    {/* Resumo final */}
                    <div style={{
                        marginTop: '16px',
                        padding: '14px',
                        borderRadius: '12px',
                        background: statistics.mendelianRatioMatch
                            ? 'linear-gradient(135deg, rgba(74, 222, 128, 0.15), rgba(74, 222, 128, 0.05))'
                            : 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(251, 191, 36, 0.05))',
                        border: `1px solid ${statistics.mendelianRatioMatch ? 'rgba(74, 222, 128, 0.4)' : 'rgba(251, 191, 36, 0.4)'}`,
                    }}>
                        <div style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: statistics.mendelianRatioMatch ? '#4ade80' : '#fbbf24',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>
                                {statistics.mendelianRatioMatch ? '✓' : '⚠'}
                            </span>
                            {statistics.mendelianRatioMatch
                                ? 'Herança Mendeliana Confirmada'
                                : 'Variação Estatística Detectada'}
                        </div>
                        <div style={{
                            fontSize: '0.75rem',
                            color: 'rgba(255, 255, 255, 0.6)',
                            marginTop: '6px',
                            lineHeight: '1.5'
                        }}>
                            {statistics.mendelianRatioMatch
                                ? 'As proporções observadas seguem os padrões mendelianos clássicos de 3:1 para monohibridismo.'
                                : 'Amostras pequenas podem mostrar variação. Tente gerar mais descendentes para resultados mais precisos.'}
                        </div>
                    </div>

                    {/* Dica educacional */}
                    <div style={{
                        marginTop: '16px',
                        padding: '12px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '10px',
                        fontSize: '0.75rem',
                        color: 'rgba(255,255,255,0.8)',
                        lineHeight: '1.5'
                    }}>
                        <div style={{ fontWeight: '700', marginBottom: '4px', color: '#818cf8' }}>
                            💡 Dica Educacional
                        </div>
                        Mendel usou mais de 28.000 plantas em seus experimentos. 
                        Quanto maior a amostra, mais próximo das proporções teóricas!
                    </div>
                </>
            )}
        </div>
    )
}

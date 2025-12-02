import { useState, useMemo } from 'react'
import type { Gene } from '../types'
import { getAlleleBySymbol } from '../data/sample-genes'
import { Grid3X3, Info } from 'lucide-react'

interface PunnettSquareProps {
    gene: Gene
    maternalAllele1: string
    maternalAllele2: string
    paternalAllele1: string
    paternalAllele2: string
    onClose?: () => void
}

export function PunnettSquare({
    gene,
    maternalAllele1,
    maternalAllele2,
    paternalAllele1,
    paternalAllele2,
    onClose
}: PunnettSquareProps) {
    const [hoveredCell, setHoveredCell] = useState<string | null>(null)

    // Calcula os genótipos do quadro
    const squares = useMemo(() => {
        const maternalGametes = [maternalAllele1, maternalAllele2]
        const paternalGametes = [paternalAllele1, paternalAllele2]

        const results: { genotype: string; maternal: string; paternal: string; phenotype: string; color: string }[] = []

        maternalGametes.forEach(mAllele => {
            paternalGametes.forEach(pAllele => {
                // Ordena para ter dominante primeiro
                const sorted = [mAllele, pAllele].sort((a, b) => {
                    if (a === a.toUpperCase() && b === b.toLowerCase()) return -1
                    if (a === a.toLowerCase() && b === b.toUpperCase()) return 1
                    return 0
                })
                const genotype = sorted.join('')

                // Determina fenótipo
                const allele1 = getAlleleBySymbol(gene, mAllele)
                const allele2 = getAlleleBySymbol(gene, pAllele)

                let phenotype = 'Desconhecido'
                let color = '#888'

                if (allele1 && allele2) {
                    if (allele1.isDominant || allele2.isDominant) {
                        const dominant = allele1.isDominant ? allele1 : allele2
                        phenotype = dominant.name
                        color = dominant.color
                    } else {
                        phenotype = allele1.name
                        color = allele1.color
                    }
                }

                results.push({
                    genotype,
                    maternal: mAllele,
                    paternal: pAllele,
                    phenotype,
                    color
                })
            })
        })

        return results
    }, [gene, maternalAllele1, maternalAllele2, paternalAllele1, paternalAllele2])

    // Calcula proporções
    const proportions = useMemo(() => {
        const phenotypeCounts = new Map<string, number>()
        const genotypeCounts = new Map<string, number>()

        squares.forEach(sq => {
            phenotypeCounts.set(sq.phenotype, (phenotypeCounts.get(sq.phenotype) || 0) + 1)
            genotypeCounts.set(sq.genotype, (genotypeCounts.get(sq.genotype) || 0) + 1)
        })

        return { phenotypeCounts, genotypeCounts }
    }, [squares])

    const maternalAllele1Data = getAlleleBySymbol(gene, maternalAllele1)
    const maternalAllele2Data = getAlleleBySymbol(gene, maternalAllele2)
    const paternalAllele1Data = getAlleleBySymbol(gene, paternalAllele1)
    const paternalAllele2Data = getAlleleBySymbol(gene, paternalAllele2)

    return (
        <div style={{
            background: 'rgba(15, 15, 25, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(99, 102, 241, 0.4)',
            borderRadius: '20px',
            padding: '24px',
            color: 'white',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            minWidth: '380px'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        borderRadius: '10px',
                        padding: '8px',
                        display: 'flex'
                    }}>
                        <Grid3X3 size={22} />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>
                            Quadro de Punnett
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                            {gene.name}
                        </p>
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                        }}
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Quadro de Punnett */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr 1fr',
                gridTemplateRows: 'auto 1fr 1fr',
                gap: '4px',
                marginBottom: '20px'
            }}>
                {/* Célula vazia no canto */}
                <div style={{
                    background: 'rgba(99, 102, 241, 0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    color: 'rgba(255,255,255,0.6)'
                }}>
                    ♀️ / ♂️
                </div>

                {/* Headers paternos */}
                <div style={{
                    background: 'rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '4px'
                }}>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>♂️ Paterno</span>
                    <span style={{
                        fontSize: '1.4rem',
                        fontWeight: '800',
                        fontFamily: 'monospace',
                        color: paternalAllele1Data?.color || '#60a5fa'
                    }}>
                        {paternalAllele1}
                    </span>
                </div>
                <div style={{
                    background: 'rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '4px'
                }}>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>♂️ Paterno</span>
                    <span style={{
                        fontSize: '1.4rem',
                        fontWeight: '800',
                        fontFamily: 'monospace',
                        color: paternalAllele2Data?.color || '#60a5fa'
                    }}>
                        {paternalAllele2}
                    </span>
                </div>

                {/* Primeira linha de resultados */}
                <div style={{
                    background: 'rgba(236, 72, 153, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '4px'
                }}>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>♀️ Materno</span>
                    <span style={{
                        fontSize: '1.4rem',
                        fontWeight: '800',
                        fontFamily: 'monospace',
                        color: maternalAllele1Data?.color || '#ec4899'
                    }}>
                        {maternalAllele1}
                    </span>
                </div>

                {/* Células do quadro */}
                {squares.slice(0, 2).map((sq, idx) => (
                    <div
                        key={`row1-${idx}`}
                        style={{
                            background: hoveredCell === `0-${idx}` 
                                ? `${sq.color}40` 
                                : 'rgba(255,255,255,0.05)',
                            border: `2px solid ${sq.color}60`,
                            borderRadius: '12px',
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={() => setHoveredCell(`0-${idx}`)}
                        onMouseLeave={() => setHoveredCell(null)}
                    >
                        <span style={{
                            fontSize: '1.6rem',
                            fontWeight: '800',
                            fontFamily: 'monospace',
                            background: `linear-gradient(135deg, ${sq.color}, ${sq.color}aa)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            {sq.genotype}
                        </span>
                        <span style={{
                            fontSize: '0.75rem',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            background: `${sq.color}30`,
                            color: sq.color,
                            fontWeight: '600'
                        }}>
                            {sq.phenotype}
                        </span>
                    </div>
                ))}

                {/* Segunda linha */}
                <div style={{
                    background: 'rgba(236, 72, 153, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '4px'
                }}>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>♀️ Materno</span>
                    <span style={{
                        fontSize: '1.4rem',
                        fontWeight: '800',
                        fontFamily: 'monospace',
                        color: maternalAllele2Data?.color || '#ec4899'
                    }}>
                        {maternalAllele2}
                    </span>
                </div>

                {squares.slice(2, 4).map((sq, idx) => (
                    <div
                        key={`row2-${idx}`}
                        style={{
                            background: hoveredCell === `1-${idx}` 
                                ? `${sq.color}40` 
                                : 'rgba(255,255,255,0.05)',
                            border: `2px solid ${sq.color}60`,
                            borderRadius: '12px',
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={() => setHoveredCell(`1-${idx}`)}
                        onMouseLeave={() => setHoveredCell(null)}
                    >
                        <span style={{
                            fontSize: '1.6rem',
                            fontWeight: '800',
                            fontFamily: 'monospace',
                            background: `linear-gradient(135deg, ${sq.color}, ${sq.color}aa)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            {sq.genotype}
                        </span>
                        <span style={{
                            fontSize: '0.75rem',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            background: `${sq.color}30`,
                            color: sq.color,
                            fontWeight: '600'
                        }}>
                            {sq.phenotype}
                        </span>
                    </div>
                ))}
            </div>

            {/* Proporções */}
            <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '16px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px'
                }}>
                    <Info size={16} color="#a855f7" />
                    <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                        Proporções Esperadas
                    </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {/* Proporção Genotípica */}
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                            Genotípica
                        </div>
                        {Array.from(proportions.genotypeCounts.entries()).map(([genotype, count]) => {
                            const allele = getAlleleBySymbol(gene, genotype[0])
                            return (
                                <div key={genotype} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '4px'
                                }}>
                                    <span style={{
                                        fontFamily: 'monospace',
                                        fontWeight: '700',
                                        color: allele?.color || '#fff'
                                    }}>
                                        {genotype}
                                    </span>
                                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                                        {count}/4 ({(count / 4 * 100).toFixed(0)}%)
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    {/* Proporção Fenotípica */}
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                            Fenotípica
                        </div>
                        {Array.from(proportions.phenotypeCounts.entries()).map(([phenotype, count]) => {
                            const allele = gene.alleles.find(a => a.name === phenotype)
                            return (
                                <div key={phenotype} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '4px'
                                }}>
                                    <div style={{
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        background: allele?.color || '#888',
                                        boxShadow: `0 0 8px ${allele?.color || '#888'}`
                                    }} />
                                    <span style={{ color: allele?.color || '#fff', fontSize: '0.85rem' }}>
                                        {phenotype}
                                    </span>
                                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                                        {count}/4
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Proporção mendeliana */}
                <div style={{
                    marginTop: '12px',
                    padding: '10px 14px',
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))',
                    borderRadius: '8px',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ fontSize: '1.2rem' }}>📊</span>
                    <div>
                        <div style={{ fontWeight: '600', fontSize: '0.85rem', color: '#22c55e' }}>
                            Proporção: {Array.from(proportions.phenotypeCounts.values()).join(':')}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                            Lei da Segregação de Mendel
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

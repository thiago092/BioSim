import type { Offspring, Gene } from '../types'
import { getGenotype } from '../utils/genetics-engine'

interface OffspringListProps {
    offspring: Offspring[]
    genes: Gene[]
    onSelect?: (offspring: Offspring) => void
}

export function OffspringList({ offspring, genes, onSelect }: OffspringListProps) {
    if (offspring.length === 0) {
        return (
            <div style={{
                position: 'absolute',
                bottom: '30px',
                left: '30px',
                width: 'calc(100% - 400px)',
                background: 'rgba(15, 15, 20, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                color: 'white',
                textAlign: 'center',
            }}>
                <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.6)' }}>
                    🧬 Nenhum descendente gerado ainda. Configure os parâmetros e clique em "Gerar Descendentes".
                </p>
            </div>
        )
    }

    return (
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
            padding: '20px',
            color: 'white',
            overflowY: 'auto',
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
            }}>
                <h3 style={{
                    margin: 0,
                    fontSize: '1.1rem',
                    fontWeight: '700',
                }}>
                    Descendentes Gerados ({offspring.length})
                </h3>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '12px',
            }}>
                {offspring.map((child, index) => (
                    <div
                        key={child.id}
                        onClick={() => onSelect?.(child)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            padding: '12px',
                            cursor: onSelect ? 'pointer' : 'default',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            if (onSelect) {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                                e.currentTarget.style.borderColor = 'rgba(68, 136, 255, 0.5)'
                                e.currentTarget.style.transform = 'translateY(-2px)'
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                            e.currentTarget.style.transform = 'translateY(0)'
                        }}
                    >
                        <div style={{
                            fontSize: '0.75rem',
                            color: 'rgba(255, 255, 255, 0.5)',
                            marginBottom: '8px',
                            fontWeight: '600',
                        }}>
                            #{index + 1}
                        </div>

                        {genes.map(gene => {
                            const genotype = getGenotype(gene, child)
                            const phenotype = child.phenotype.get(gene.id) || 'Desconhecido'

                            // Encontra a cor do alelo dominante para o fenótipo
                            const allele = gene.alleles.find(a => a.name === phenotype)
                            const phenotypeColor = allele?.color || '#888'

                            return (
                                <div key={gene.id} style={{ marginBottom: '8px' }}>
                                    <div style={{
                                        fontSize: '0.8rem',
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        marginBottom: '4px',
                                    }}>
                                        {gene.name}
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                        <span style={{
                                            fontSize: '0.9rem',
                                            fontWeight: '700',
                                            fontFamily: 'monospace',
                                            color: '#4488ff',
                                        }}>
                                            {genotype}
                                        </span>
                                        <span style={{
                                            fontSize: '0.85rem',
                                            padding: '2px 8px',
                                            borderRadius: '8px',
                                            background: `${phenotypeColor}33`,
                                            color: phenotypeColor,
                                            fontWeight: '600',
                                        }}>
                                            {phenotype}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}

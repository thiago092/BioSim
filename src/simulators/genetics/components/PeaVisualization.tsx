import { useMemo } from 'react'
import type { Offspring, Gene } from '../types'

interface PeaVisualizationProps {
    offspring: Offspring
    genes: Gene[]
    size?: 'small' | 'medium' | 'large'
}

export function PeaVisualization({ offspring, genes, size = 'medium' }: PeaVisualizationProps) {
    const sizeMap = {
        small: { pea: 30, fontSize: 8 },
        medium: { pea: 50, fontSize: 12 },
        large: { pea: 80, fontSize: 16 }
    }

    const { pea: peaSize, fontSize } = sizeMap[size]

    // Obtém fenótipos
    const phenotypes = useMemo(() => {
        const result: Record<string, { phenotype: string; color: string; allele: { symbol: string; name: string; color: string; isDominant: boolean } | undefined }> = {}

        genes.forEach(gene => {
            const phenotype = offspring.phenotype.get(gene.id) || 'Desconhecido'
            const allele = gene.alleles.find(a => a.name === phenotype)
            result[gene.id] = { phenotype, color: allele?.color || '#888', allele }
        })

        return result
    }, [offspring, genes])

    // Determina cor e textura da semente
    const seedColor = phenotypes['seed-color']?.color || '#fbbf24'
    const seedTexture = phenotypes['seed-texture']?.phenotype
    const isWrinkled = seedTexture === 'Rugosa'

    // Determina cor da flor
    const flowerColor = phenotypes['flower-color']?.color || '#a855f7'

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
        }}>
            {/* Ervilha SVG */}
            <svg 
                width={peaSize} 
                height={peaSize} 
                viewBox="0 0 100 100"
                style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
            >
                <defs>
                    {/* Gradiente para aparência 3D */}
                    <radialGradient id={`peaGrad-${offspring.id}`} cx="30%" cy="30%" r="70%">
                        <stop offset="0%" stopColor={lightenColor(seedColor, 30)} />
                        <stop offset="50%" stopColor={seedColor} />
                        <stop offset="100%" stopColor={darkenColor(seedColor, 30)} />
                    </radialGradient>

                    {/* Padrão para textura rugosa */}
                    <pattern id={`wrinkle-${offspring.id}`} patternUnits="userSpaceOnUse" width="8" height="8">
                        <circle cx="4" cy="4" r="2" fill={darkenColor(seedColor, 15)} opacity="0.5" />
                    </pattern>
                </defs>

                {/* Ervilha base */}
                <ellipse
                    cx="50"
                    cy="50"
                    rx="42"
                    ry="40"
                    fill={`url(#peaGrad-${offspring.id})`}
                    stroke={darkenColor(seedColor, 20)}
                    strokeWidth="2"
                />

                {/* Textura rugosa */}
                {isWrinkled && (
                    <>
                        <ellipse
                            cx="50"
                            cy="50"
                            rx="42"
                            ry="40"
                            fill={`url(#wrinkle-${offspring.id})`}
                        />
                        {/* Rugas adicionais */}
                        <path
                            d="M 25 40 Q 35 35 45 42 Q 55 48 65 40 Q 75 32 80 45"
                            fill="none"
                            stroke={darkenColor(seedColor, 25)}
                            strokeWidth="1.5"
                            opacity="0.4"
                        />
                        <path
                            d="M 20 55 Q 30 50 40 58 Q 50 65 60 55 Q 70 45 85 55"
                            fill="none"
                            stroke={darkenColor(seedColor, 25)}
                            strokeWidth="1.5"
                            opacity="0.4"
                        />
                        <path
                            d="M 30 65 Q 40 70 50 65 Q 60 60 70 68"
                            fill="none"
                            stroke={darkenColor(seedColor, 25)}
                            strokeWidth="1.5"
                            opacity="0.4"
                        />
                    </>
                )}

                {/* Brilho */}
                <ellipse
                    cx="35"
                    cy="35"
                    rx="15"
                    ry="10"
                    fill="white"
                    opacity="0.3"
                />

                {/* Pequena flor decorativa se tivermos o gene de cor de flor */}
                {phenotypes['flower-color'] && (
                    <g transform="translate(75, 15) scale(0.4)">
                        {[0, 72, 144, 216, 288].map((angle, i) => (
                            <ellipse
                                key={i}
                                cx="0"
                                cy="-15"
                                rx="8"
                                ry="12"
                                fill={flowerColor}
                                transform={`rotate(${angle})`}
                                opacity="0.9"
                            />
                        ))}
                        <circle cx="0" cy="0" r="6" fill="#fbbf24" />
                    </g>
                )}
            </svg>

            {/* Labels dos fenótipos */}
            {size !== 'small' && (
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px',
                    justifyContent: 'center',
                    maxWidth: peaSize * 2
                }}>
                    {Object.entries(phenotypes).map(([geneId, { phenotype, color }]) => (
                        <span
                            key={geneId}
                            style={{
                                fontSize: `${fontSize}px`,
                                padding: '2px 6px',
                                borderRadius: '10px',
                                background: `${color}30`,
                                color: color,
                                fontWeight: '600',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {phenotype}
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}

// Helpers para manipular cores
function lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = Math.min(255, (num >> 16) + amt)
    const G = Math.min(255, (num >> 8 & 0x00FF) + amt)
    const B = Math.min(255, (num & 0x0000FF) + amt)
    return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`
}

function darkenColor(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = Math.max(0, (num >> 16) - amt)
    const G = Math.max(0, (num >> 8 & 0x00FF) - amt)
    const B = Math.max(0, (num & 0x0000FF) - amt)
    return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`
}

// Componente para mostrar várias ervilhas
interface PeaGridProps {
    offspring: Offspring[]
    genes: Gene[]
    maxDisplay?: number
}

export function PeaGrid({ offspring, genes, maxDisplay = 20 }: PeaGridProps) {
    const displayOffspring = offspring.slice(0, maxDisplay)

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
            gap: '12px',
            padding: '16px'
        }}>
            {displayOffspring.map((child, index) => (
                <div
                    key={child.id}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    <span style={{
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.5)',
                        fontWeight: '600'
                    }}>
                        #{index + 1}
                    </span>
                    <PeaVisualization offspring={child} genes={genes} size="small" />
                </div>
            ))}
            {offspring.length > maxDisplay && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    padding: '8px'
                }}>
                    +{offspring.length - maxDisplay} mais
                </div>
            )}
        </div>
    )
}

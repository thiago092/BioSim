import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Text, Html } from '@react-three/drei'
import { GENETIC_CODE } from '../data/educational-content'

interface TranslationViewProps {
    speed?: number
    onSelectElement?: (element: string) => void
}

// mRNA sequence (cada 3 = 1 códon)
const MRNA_SEQUENCE = ['A', 'U', 'G', 'G', 'C', 'U', 'U', 'A', 'C', 'G', 'A', 'U', 'C', 'A', 'G', 'U', 'A', 'A']

const RNA_COLORS: Record<string, string> = {
    A: '#4ade80',
    U: '#c084fc',
    C: '#60a5fa',
    G: '#fbbf24',
}

const AMINO_ACID_COLORS: Record<string, string> = {
    Met: '#f43f5e',
    Ala: '#06b6d4',
    Tyr: '#a855f7',
    Asp: '#22c55e',
    Gln: '#f97316',
    Stop: '#6b7280',
    Leu: '#eab308',
    Ser: '#ec4899',
    Pro: '#14b8a6',
    Thr: '#8b5cf6',
    Ile: '#ef4444',
    Val: '#3b82f6',
    Phe: '#84cc16',
    His: '#f472b6',
    Asn: '#06b6d4',
    Lys: '#fbbf24',
    Glu: '#22d3ee',
    Cys: '#a3e635',
    Trp: '#c084fc',
    Arg: '#fb923c',
    Gly: '#94a3b8',
}

export function TranslationView({ speed = 1, onSelectElement }: TranslationViewProps) {
    const groupRef = useRef<Group>(null)
    const [translationProgress, setTranslationProgress] = useState(0)
    const [hoveredElement, setHoveredElement] = useState<string | null>(null)

    // Parse codons
    const codons = useMemo(() => {
        const result = []
        for (let i = 0; i < MRNA_SEQUENCE.length; i += 3) {
            const codon = MRNA_SEQUENCE.slice(i, i + 3).join('')
            result.push({
                codon,
                aminoAcid: GENETIC_CODE[codon] || '???',
                bases: MRNA_SEQUENCE.slice(i, i + 3)
            })
        }
        return result
    }, [])

    useFrame((state, delta) => {
        setTranslationProgress((prev) => {
            const newProgress = prev + delta * 0.05 * speed
            return newProgress > 1 ? 0 : newProgress
        })

        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.1
        }
    })

    const currentCodonIndex = useMemo(() => {
        return Math.floor(translationProgress * codons.length)
    }, [translationProgress, codons.length])

    const ribosomePosition = useMemo(() => {
        return (currentCodonIndex / codons.length) * 10 - 5
    }, [currentCodonIndex, codons.length])

    return (
        <group ref={groupRef}>
            {/* Título */}
            <Text
                position={[0, 6, 0]}
                fontSize={0.4}
                color="#ffffff"
                anchorX="center"
            >
                🏭 TRADUÇÃO (Síntese de Proteínas)
            </Text>
            <Text
                position={[0, 5.5, 0]}
                fontSize={0.2}
                color="#94a3b8"
                anchorX="center"
            >
                mRNA → Proteína (no Ribossomo)
            </Text>

            {/* mRNA strand */}
            <group position={[0, -2, 0]}>
                <Text
                    position={[-6, 0.8, 0]}
                    fontSize={0.18}
                    color="#c084fc"
                    anchorX="left"
                >
                    mRNA 5' →
                </Text>
                <Text
                    position={[6, 0.8, 0]}
                    fontSize={0.18}
                    color="#c084fc"
                    anchorX="right"
                >
                    → 3'
                </Text>

                {MRNA_SEQUENCE.map((base, i) => {
                    const x = (i / MRNA_SEQUENCE.length) * 10 - 5
                    const codonIndex = Math.floor(i / 3)
                    const isCurrentCodon = codonIndex === currentCodonIndex
                    const isTranslated = codonIndex < currentCodonIndex

                    return (
                        <group key={`mrna-${i}`} position={[x, 0, 0]}>
                            {/* Base do mRNA */}
                            <mesh
                                onPointerEnter={() => setHoveredElement(`mrna-${base}`)}
                                onPointerLeave={() => setHoveredElement(null)}
                            >
                                <sphereGeometry args={[0.15, 16, 16]} />
                                <meshStandardMaterial
                                    color={RNA_COLORS[base]}
                                    emissive={RNA_COLORS[base]}
                                    emissiveIntensity={isCurrentCodon ? 0.8 : isTranslated ? 0.2 : 0.4}
                                    transparent
                                    opacity={isTranslated ? 0.6 : 1}
                                />
                            </mesh>

                            {/* Label base */}
                            <Text
                                position={[0, -0.35, 0]}
                                fontSize={0.12}
                                color={RNA_COLORS[base]}
                                anchorX="center"
                            >
                                {base}
                            </Text>

                            {/* Conexão backbone mRNA */}
                            {i < MRNA_SEQUENCE.length - 1 && (
                                <mesh position={[0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                                    <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
                                    <meshBasicMaterial color="#c084fc" transparent opacity={0.6} />
                                </mesh>
                            )}

                            {/* Separador de códons */}
                            {i % 3 === 2 && i < MRNA_SEQUENCE.length - 1 && (
                                <mesh position={[0.3, 0, 0]}>
                                    <boxGeometry args={[0.03, 0.5, 0.03]} />
                                    <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
                                </mesh>
                            )}
                        </group>
                    )
                })}

                {/* Labels dos códons */}
                {codons.map((codon, i) => {
                    const x = ((i * 3 + 1) / MRNA_SEQUENCE.length) * 10 - 5
                    const isCurrentCodon = i === currentCodonIndex
                    const isTranslated = i < currentCodonIndex

                    return (
                        <group key={`codon-label-${i}`} position={[x, -0.8, 0]}>
                            <Text
                                fontSize={0.1}
                                color={isCurrentCodon ? '#22c55e' : isTranslated ? '#6b7280' : '#94a3b8'}
                                anchorX="center"
                            >
                                {codon.codon}
                            </Text>
                        </group>
                    )
                })}
            </group>

            {/* Ribossomo */}
            <group position={[ribosomePosition, -1, 0]}>
                {/* Subunidade grande (60S) */}
                <mesh
                    position={[0, 0.8, 0]}
                    onPointerEnter={() => setHoveredElement('ribosome')}
                    onPointerLeave={() => setHoveredElement(null)}
                    onClick={() => onSelectElement?.('ribosome')}
                >
                    <sphereGeometry args={[0.7, 32, 32]} />
                    <meshStandardMaterial
                        color="#14b8a6"
                        emissive="#14b8a6"
                        emissiveIntensity={hoveredElement === 'ribosome' ? 0.6 : 0.3}
                        transparent
                        opacity={0.85}
                        metalness={0.3}
                        roughness={0.5}
                    />
                </mesh>

                {/* Subunidade pequena (40S) */}
                <mesh position={[0, -0.3, 0]}>
                    <sphereGeometry args={[0.5, 32, 32]} />
                    <meshStandardMaterial
                        color="#0d9488"
                        emissive="#0d9488"
                        emissiveIntensity={0.3}
                        transparent
                        opacity={0.85}
                        metalness={0.3}
                        roughness={0.5}
                    />
                </mesh>

                {/* Site A, P, E labels */}
                <Text position={[-0.5, 0.3, 0.8]} fontSize={0.12} color="#f43f5e" anchorX="center">
                    E
                </Text>
                <Text position={[0, 0.3, 0.8]} fontSize={0.12} color="#22c55e" anchorX="center">
                    P
                </Text>
                <Text position={[0.5, 0.3, 0.8]} fontSize={0.12} color="#3b82f6" anchorX="center">
                    A
                </Text>

                <Html position={[1.2, 0.5, 0]} style={{ pointerEvents: 'none' }}>
                    <div style={{
                        background: 'rgba(0,0,0,0.9)',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        color: '#14b8a6',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        border: '1px solid #14b8a6'
                    }}>
                        🏗️ Ribossomo
                        <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px' }}>
                            Sites: A (entrada) | P (síntese) | E (saída)
                        </div>
                    </div>
                </Html>
            </group>

            {/* tRNA atual trazendo aminoácido */}
            {currentCodonIndex < codons.length && codons[currentCodonIndex].aminoAcid !== 'Stop' && (
                <group position={[ribosomePosition + 0.3, 0.5, 0.5]}>
                    {/* Estrutura do tRNA (forma de L) */}
                    <mesh rotation={[0, 0, Math.PI / 4]}>
                        <capsuleGeometry args={[0.08, 0.6, 8, 16]} />
                        <meshStandardMaterial
                            color="#f97316"
                            emissive="#f97316"
                            emissiveIntensity={0.4}
                        />
                    </mesh>
                    <mesh position={[0.2, 0.3, 0]} rotation={[0, 0, -Math.PI / 4]}>
                        <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
                        <meshStandardMaterial
                            color="#f97316"
                            emissive="#f97316"
                            emissiveIntensity={0.4}
                        />
                    </mesh>

                    {/* Aminoácido no topo */}
                    <mesh position={[0.35, 0.5, 0]}>
                        <dodecahedronGeometry args={[0.15, 0]} />
                        <meshStandardMaterial
                            color={AMINO_ACID_COLORS[codons[currentCodonIndex].aminoAcid] || '#ffffff'}
                            emissive={AMINO_ACID_COLORS[codons[currentCodonIndex].aminoAcid] || '#ffffff'}
                            emissiveIntensity={0.6}
                        />
                    </mesh>

                    <Html position={[0.6, 0.5, 0]} style={{ pointerEvents: 'none' }}>
                        <div style={{
                            background: 'rgba(0,0,0,0.85)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            color: AMINO_ACID_COLORS[codons[currentCodonIndex].aminoAcid] || '#ffffff',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap'
                        }}>
                            {codons[currentCodonIndex].aminoAcid}
                        </div>
                    </Html>

                    {/* Anticódon */}
                    <Text
                        position={[0, -0.4, 0]}
                        fontSize={0.1}
                        color="#f97316"
                        anchorX="center"
                    >
                        tRNA
                    </Text>
                </group>
            )}

            {/* Cadeia polipeptídica (proteína sendo formada) */}
            <group position={[ribosomePosition - 1, 2, 0]}>
                <Text
                    position={[0, 1.2, 0]}
                    fontSize={0.15}
                    color="#f43f5e"
                    anchorX="center"
                >
                    Proteína (cadeia polipeptídica)
                </Text>

                {codons.slice(0, currentCodonIndex).map((codon, i) => {
                    if (codon.aminoAcid === 'Stop') return null
                    const angle = (i / 6) * Math.PI * 2
                    const radius = 0.3 + i * 0.1
                    const x = Math.cos(angle) * radius - i * 0.15
                    const y = Math.sin(angle) * 0.2 + 0.5

                    return (
                        <group key={`amino-${i}`} position={[x, y, 0]}>
                            <mesh
                                onPointerEnter={() => setHoveredElement(`amino-${codon.aminoAcid}`)}
                                onPointerLeave={() => setHoveredElement(null)}
                                onClick={() => onSelectElement?.(`amino-${codon.aminoAcid}`)}
                            >
                                <dodecahedronGeometry args={[0.12, 0]} />
                                <meshStandardMaterial
                                    color={AMINO_ACID_COLORS[codon.aminoAcid] || '#ffffff'}
                                    emissive={AMINO_ACID_COLORS[codon.aminoAcid] || '#ffffff'}
                                    emissiveIntensity={hoveredElement === `amino-${codon.aminoAcid}` ? 0.8 : 0.5}
                                    metalness={0.4}
                                    roughness={0.4}
                                />
                            </mesh>

                            {/* Ligação peptídica */}
                            {i > 0 && (
                                <mesh
                                    position={[0.1, -0.05, 0]}
                                    rotation={[0, 0, Math.PI / 2 + angle * 0.1]}
                                >
                                    <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
                                    <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
                                </mesh>
                            )}

                            <Text
                                position={[0, -0.25, 0]}
                                fontSize={0.08}
                                color={AMINO_ACID_COLORS[codon.aminoAcid] || '#ffffff'}
                                anchorX="center"
                            >
                                {codon.aminoAcid}
                            </Text>
                        </group>
                    )
                })}
            </group>

            {/* Legenda do código genético */}
            <Html position={[-5.5, 3, 0]} style={{ pointerEvents: 'none' }}>
                <div style={{
                    background: 'rgba(0,0,0,0.9)',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '10px',
                    width: '180px',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#22c55e', fontSize: '12px' }}>
                        📖 Código Genético
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                        <div>▶️ AUG = Start</div>
                        <div>⏹️ UAA = Stop</div>
                        <div style={{ color: AMINO_ACID_COLORS.Met }}>Met = Metionina</div>
                        <div style={{ color: AMINO_ACID_COLORS.Ala }}>Ala = Alanina</div>
                        <div style={{ color: AMINO_ACID_COLORS.Tyr }}>Tyr = Tirosina</div>
                        <div style={{ color: AMINO_ACID_COLORS.Asp }}>Asp = Aspartato</div>
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '9px', color: '#94a3b8' }}>
                        64 códons → 20 aminoácidos
                    </div>
                </div>
            </Html>

            {/* Partículas ambiente */}
            {Array.from({ length: 25 }).map((_, i) => {
                const angle = (i / 25) * Math.PI * 2
                const radius = 7 + Math.random() * 2
                const y = (Math.random() - 0.5) * 10
                return (
                    <mesh
                        key={`particle-${i}`}
                        position={[
                            Math.cos(angle) * radius,
                            y,
                            Math.sin(angle) * radius,
                        ]}
                    >
                        <sphereGeometry args={[0.03, 8, 8]} />
                        <meshBasicMaterial
                            color={Object.values(RNA_COLORS)[i % 4]}
                            transparent
                            opacity={0.3}
                        />
                    </mesh>
                )
            })}
        </group>
    )
}

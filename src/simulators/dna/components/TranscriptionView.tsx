import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Text, Html } from '@react-three/drei'
import { BASE_COLORS, STRUCTURE_COLORS } from '../data/educational-content'

interface TranscriptionViewProps {
    speed?: number
    onSelectElement?: (element: string) => void
}

// Sequência de DNA template (3' -> 5')
const DNA_TEMPLATE = ['T', 'A', 'C', 'G', 'A', 'T', 'G', 'C', 'A', 'T', 'G', 'C', 'G', 'A', 'T', 'A']
// Complemento DNA -> RNA: A->U, T->A, C->G, G->C
const DNA_TO_RNA: Record<string, string> = { A: 'U', T: 'A', C: 'G', G: 'C' }

const RNA_COLORS = {
    A: '#4ade80', // Verde - Adenina
    U: '#c084fc', // Roxo - Uracila (substitui Timina)
    C: '#60a5fa', // Azul - Citosina
    G: '#fbbf24', // Amarelo - Guanina
}

export function TranscriptionView({ speed = 1, onSelectElement }: TranscriptionViewProps) {
    const groupRef = useRef<Group>(null)
    const [transcriptionProgress, setTranscriptionProgress] = useState(0)
    const [hoveredElement, setHoveredElement] = useState<string | null>(null)

    useFrame((state, delta) => {
        setTranscriptionProgress((prev) => {
            const newProgress = prev + delta * 0.06 * speed
            return newProgress > 1 ? 0 : newProgress
        })

        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.15
        }
    })

    const rnaPolPosition = useMemo(() => {
        return transcriptionProgress * DNA_TEMPLATE.length
    }, [transcriptionProgress])

    return (
        <group ref={groupRef}>
            {/* Título */}
            <Text
                position={[0, 5.5, 0]}
                fontSize={0.4}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
            >
                📝 TRANSCRIÇÃO DO DNA
            </Text>

            <Text
                position={[0, 5, 0]}
                fontSize={0.2}
                color="#94a3b8"
                anchorX="center"
            >
                DNA → mRNA
            </Text>

            {/* DNA Template Strand (fita molde 3' → 5') */}
            <group position={[-1.2, 0, 0]}>
                <Text
                    position={[0, 4.2, 0]}
                    fontSize={0.18}
                    color="#f87171"
                    anchorX="center"
                >
                    Fita Molde (Template)
                </Text>
                <Text
                    position={[0, 3.9, 0]}
                    fontSize={0.14}
                    color="#f87171"
                    anchorX="center"
                >
                    3' → 5'
                </Text>

                {DNA_TEMPLATE.map((base, i) => {
                    const y = (i / DNA_TEMPLATE.length) * 8 - 4
                    const isTranscribed = i < rnaPolPosition

                    return (
                        <group key={`template-${i}`} position={[0, y, 0]}>
                            {/* Backbone */}
                            <mesh position={[-0.4, 0, 0]}>
                                <sphereGeometry args={[0.07, 12, 12]} />
                                <meshStandardMaterial
                                    color={STRUCTURE_COLORS.backbone}
                                    emissive={isTranscribed ? '#22c55e' : '#000000'}
                                    emissiveIntensity={isTranscribed ? 0.3 : 0}
                                />
                            </mesh>

                            {/* Base */}
                            <mesh
                                position={[0, 0, 0]}
                                onPointerEnter={() => setHoveredElement(`dna-${base}`)}
                                onPointerLeave={() => setHoveredElement(null)}
                                onClick={() => onSelectElement?.(`dna-${base}`)}
                            >
                                <sphereGeometry args={[0.1, 16, 16]} />
                                <meshStandardMaterial
                                    color={BASE_COLORS[base as keyof typeof BASE_COLORS]}
                                    emissive={BASE_COLORS[base as keyof typeof BASE_COLORS]}
                                    emissiveIntensity={isTranscribed ? 0.6 : 0.3}
                                />
                            </mesh>

                            {/* Label */}
                            <Text
                                position={[-0.7, 0, 0]}
                                fontSize={0.12}
                                color={BASE_COLORS[base as keyof typeof BASE_COLORS]}
                                anchorX="right"
                            >
                                {base}
                            </Text>

                            {/* Conexão backbone */}
                            {i < DNA_TEMPLATE.length - 1 && (
                                <mesh position={[-0.4, 0.25, 0]} rotation={[0, 0, 0]}>
                                    <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
                                    <meshBasicMaterial color={STRUCTURE_COLORS.backbone} />
                                </mesh>
                            )}
                        </group>
                    )
                })}
            </group>

            {/* DNA Coding Strand (fita codificante 5' → 3') */}
            <group position={[1.2, 0, 0]}>
                <Text
                    position={[0, 4.2, 0]}
                    fontSize={0.18}
                    color="#60a5fa"
                    anchorX="center"
                >
                    Fita Codificante
                </Text>
                <Text
                    position={[0, 3.9, 0]}
                    fontSize={0.14}
                    color="#60a5fa"
                    anchorX="center"
                >
                    5' → 3'
                </Text>

                {DNA_TEMPLATE.map((base, i) => {
                    const y = (i / DNA_TEMPLATE.length) * 8 - 4
                    const complement = DNA_TO_RNA[base] === 'U' ? 'A' : DNA_TO_RNA[base] === 'A' ? 'T' : DNA_TO_RNA[base] === 'G' ? 'C' : 'G'

                    return (
                        <group key={`coding-${i}`} position={[0, y, 0]}>
                            {/* Base */}
                            <mesh position={[0, 0, 0]}>
                                <sphereGeometry args={[0.1, 16, 16]} />
                                <meshStandardMaterial
                                    color={BASE_COLORS[complement as keyof typeof BASE_COLORS]}
                                    emissive={BASE_COLORS[complement as keyof typeof BASE_COLORS]}
                                    emissiveIntensity={0.3}
                                />
                            </mesh>

                            {/* Backbone */}
                            <mesh position={[0.4, 0, 0]}>
                                <sphereGeometry args={[0.07, 12, 12]} />
                                <meshStandardMaterial color={STRUCTURE_COLORS.backbone} />
                            </mesh>

                            {/* Label */}
                            <Text
                                position={[0.7, 0, 0]}
                                fontSize={0.12}
                                color={BASE_COLORS[complement as keyof typeof BASE_COLORS]}
                                anchorX="left"
                            >
                                {complement}
                            </Text>

                            {/* Ligação de hidrogênio entre as fitas */}
                            <mesh position={[-0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                                <cylinderGeometry args={[0.015, 0.015, 1.2, 8]} />
                                <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
                            </mesh>
                        </group>
                    )
                })}
            </group>

            {/* mRNA sendo sintetizado */}
            <group position={[0, 0, 1.5]}>
                <Text
                    position={[0, 4.2, 0]}
                    fontSize={0.18}
                    color="#c084fc"
                    anchorX="center"
                >
                    mRNA (produto)
                </Text>
                <Text
                    position={[0, 3.9, 0]}
                    fontSize={0.14}
                    color="#c084fc"
                    anchorX="center"
                >
                    5' → 3'
                </Text>

                {DNA_TEMPLATE.map((base, i) => {
                    const y = (i / DNA_TEMPLATE.length) * 8 - 4
                    const isTranscribed = i < rnaPolPosition
                    const rnaBase = DNA_TO_RNA[base]

                    if (!isTranscribed) return null

                    return (
                        <group key={`rna-${i}`} position={[0, y, 0]}>
                            {/* Base RNA */}
                            <mesh
                                onPointerEnter={() => setHoveredElement(`rna-${rnaBase}`)}
                                onPointerLeave={() => setHoveredElement(null)}
                                onClick={() => onSelectElement?.(`rna-${rnaBase}`)}
                            >
                                <sphereGeometry args={[0.12, 16, 16]} />
                                <meshStandardMaterial
                                    color={RNA_COLORS[rnaBase as keyof typeof RNA_COLORS]}
                                    emissive={RNA_COLORS[rnaBase as keyof typeof RNA_COLORS]}
                                    emissiveIntensity={0.7}
                                    transparent
                                    opacity={0.9}
                                />
                            </mesh>

                            {/* Backbone RNA (ribose) */}
                            <mesh position={[0.35, 0, 0]}>
                                <sphereGeometry args={[0.06, 12, 12]} />
                                <meshStandardMaterial
                                    color="#c084fc"
                                    emissive="#c084fc"
                                    emissiveIntensity={0.3}
                                />
                            </mesh>

                            {/* Label */}
                            <Text
                                position={[0.6, 0, 0]}
                                fontSize={0.14}
                                color={RNA_COLORS[rnaBase as keyof typeof RNA_COLORS]}
                                anchorX="left"
                                fontWeight="bold"
                            >
                                {rnaBase}
                            </Text>

                            {/* Conexão RNA */}
                            {i > 0 && i < rnaPolPosition && (
                                <mesh position={[0.35, -0.25, 0]}>
                                    <cylinderGeometry args={[0.015, 0.015, 0.5, 8]} />
                                    <meshBasicMaterial color="#c084fc" />
                                </mesh>
                            )}
                        </group>
                    )
                })}
            </group>

            {/* RNA Polimerase */}
            <group position={[-0.6, (rnaPolPosition / DNA_TEMPLATE.length) * 8 - 4, 0.5]}>
                <mesh
                    onPointerEnter={() => setHoveredElement('rna-pol')}
                    onPointerLeave={() => setHoveredElement(null)}
                    onClick={() => onSelectElement?.('rna-polymerase')}
                >
                    <icosahedronGeometry args={[0.35, 1]} />
                    <meshStandardMaterial
                        color="#8b5cf6"
                        emissive="#8b5cf6"
                        emissiveIntensity={hoveredElement === 'rna-pol' ? 0.9 : 0.6}
                        metalness={0.7}
                        roughness={0.2}
                    />
                </mesh>
                <Html position={[0.7, 0, 0]} style={{ pointerEvents: 'none' }}>
                    <div style={{
                        background: 'rgba(0,0,0,0.9)',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        color: '#8b5cf6',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        border: '1px solid #8b5cf6'
                    }}>
                        🔬 RNA Polimerase
                    </div>
                </Html>
            </group>

            {/* Indicador de Promotor */}
            <group position={[-1.2, -4.3, 0]}>
                <mesh>
                    <boxGeometry args={[0.6, 0.15, 0.1]} />
                    <meshStandardMaterial
                        color="#22c55e"
                        emissive="#22c55e"
                        emissiveIntensity={0.5}
                    />
                </mesh>
                <Text
                    position={[0, -0.3, 0]}
                    fontSize={0.12}
                    color="#22c55e"
                    anchorX="center"
                >
                    Promotor (TATA box)
                </Text>
            </group>

            {/* Info Box - Diferença DNA vs RNA */}
            <Html position={[3.5, 0, 0]} style={{ pointerEvents: 'none' }}>
                <div style={{
                    background: 'rgba(0,0,0,0.85)',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '11px',
                    width: '160px',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#c084fc' }}>
                        📋 RNA vs DNA
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                        • <span style={{ color: '#c084fc' }}>Uracila (U)</span> no lugar de T
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                        • Ribose no lugar de desoxirribose
                    </div>
                    <div>
                        • Fita simples
                    </div>
                </div>
            </Html>

            {/* Partículas ambiente */}
            {Array.from({ length: 30 }).map((_, i) => {
                const angle = (i / 30) * Math.PI * 2
                const radius = 5 + Math.random()
                const y = (Math.random() - 0.5) * 12
                return (
                    <mesh
                        key={`particle-${i}`}
                        position={[
                            Math.cos(angle) * radius,
                            y,
                            Math.sin(angle) * radius,
                        ]}
                    >
                        <sphereGeometry args={[0.025, 8, 8]} />
                        <meshBasicMaterial
                            color={i % 2 === 0 ? '#c084fc' : '#8b5cf6'}
                            transparent
                            opacity={0.4}
                        />
                    </mesh>
                )
            })}
        </group>
    )
}

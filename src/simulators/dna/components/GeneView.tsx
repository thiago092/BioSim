import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Text, Html } from '@react-three/drei'

// Estrutura de um gene com regiões
interface GeneRegion {
    name: string
    type: 'promoter' | 'exon' | 'intron' | 'terminator' | 'utr'
    start: number
    length: number
    color: string
    glowColor: string
    description: string
}

const GENE_STRUCTURE: GeneRegion[] = [
    { name: "5' UTR", type: 'utr', start: -2.8, length: 0.4, color: '#94a3b8', glowColor: '#64748b', description: 'Região não traduzida' },
    { name: 'Promotor', type: 'promoter', start: -2.3, length: 0.5, color: '#22c55e', glowColor: '#4ade80', description: 'Inicia a transcrição' },
    { name: 'Éxon 1', type: 'exon', start: -1.6, length: 0.6, color: '#3b82f6', glowColor: '#60a5fa', description: 'Codifica proteína' },
    { name: 'Íntron 1', type: 'intron', start: -0.9, length: 0.5, color: '#6b7280', glowColor: '#9ca3af', description: 'Removido no splicing' },
    { name: 'Éxon 2', type: 'exon', start: -0.3, length: 0.8, color: '#3b82f6', glowColor: '#60a5fa', description: 'Codifica proteína' },
    { name: 'Íntron 2', type: 'intron', start: 0.6, length: 0.4, color: '#6b7280', glowColor: '#9ca3af', description: 'Removido no splicing' },
    { name: 'Éxon 3', type: 'exon', start: 1.1, length: 0.7, color: '#3b82f6', glowColor: '#60a5fa', description: 'Codifica proteína' },
    { name: 'Terminador', type: 'terminator', start: 1.9, length: 0.4, color: '#ef4444', glowColor: '#f87171', description: 'Finaliza transcrição' },
    { name: "3' UTR", type: 'utr', start: 2.4, length: 0.4, color: '#94a3b8', glowColor: '#64748b', description: 'Região não traduzida' },
]

export function GeneView() {
    const geneRef = useRef<Group>(null)
    const [hoveredRegion, setHoveredRegion] = useState<GeneRegion | null>(null)
    const [showDetails] = useState(true)

    useFrame((state) => {
        if (geneRef.current) {
            geneRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.2
        }
    })

    // DNA backbone
    const backboneSegments = useMemo(() => {
        return Array.from({ length: 80 }).map((_, i) => {
            const t = (i / 80) * 6 - 3
            return {
                y: t,
                angle: i * 0.3,
            }
        })
    }, [])

    return (
        <group ref={geneRef}>
            {/* Título */}
            <Text
                position={[0, 4.2, 0]}
                fontSize={0.35}
                color="#ffffff"
                anchorX="center"
            >
                🧬 ESTRUTURA DO GENE
            </Text>
            <Text
                position={[0, 3.8, 0]}
                fontSize={0.16}
                color="#94a3b8"
                anchorX="center"
            >
                Segmento de DNA que codifica uma proteína
            </Text>

            {/* DNA backbone (fita dupla simplificada) */}
            <group>
                {backboneSegments.map((seg, i) => (
                    <group key={`backbone-${i}`} position={[0, seg.y, 0]}>
                        {/* Fita esquerda */}
                        <mesh position={[-0.35, 0, Math.sin(seg.angle) * 0.1]}>
                            <sphereGeometry args={[0.04, 8, 8]} />
                            <meshStandardMaterial
                                color="#a855f7"
                                emissive="#c084fc"
                                emissiveIntensity={0.3}
                            />
                        </mesh>
                        {/* Fita direita */}
                        <mesh position={[0.35, 0, Math.sin(seg.angle + Math.PI) * 0.1]}>
                            <sphereGeometry args={[0.04, 8, 8]} />
                            <meshStandardMaterial
                                color="#a855f7"
                                emissive="#c084fc"
                                emissiveIntensity={0.3}
                            />
                        </mesh>
                    </group>
                ))}
            </group>

            {/* Regiões do gene */}
            {GENE_STRUCTURE.map((region) => (
                <group key={region.name}>
                    {/* Região principal */}
                    <mesh
                        position={[0, region.start + region.length / 2, 0]}
                        onPointerEnter={() => setHoveredRegion(region)}
                        onPointerLeave={() => setHoveredRegion(null)}
                    >
                        <cylinderGeometry args={[
                            region.type === 'exon' ? 0.28 : region.type === 'intron' ? 0.15 : 0.22,
                            region.type === 'exon' ? 0.28 : region.type === 'intron' ? 0.15 : 0.22,
                            region.length,
                            24
                        ]} />
                        <meshStandardMaterial
                            color={region.color}
                            emissive={region.glowColor}
                            emissiveIntensity={hoveredRegion?.name === region.name ? 0.8 : 0.4}
                            metalness={0.3}
                            roughness={0.5}
                            transparent={region.type === 'intron'}
                            opacity={region.type === 'intron' ? 0.7 : 1}
                        />
                    </mesh>

                    {/* Anel decorativo para éxons */}
                    {region.type === 'exon' && (
                        <>
                            <mesh position={[0, region.start, 0]} rotation={[Math.PI / 2, 0, 0]}>
                                <torusGeometry args={[0.32, 0.02, 16, 32]} />
                                <meshBasicMaterial color={region.glowColor} transparent opacity={0.6} />
                            </mesh>
                            <mesh position={[0, region.start + region.length, 0]} rotation={[Math.PI / 2, 0, 0]}>
                                <torusGeometry args={[0.32, 0.02, 16, 32]} />
                                <meshBasicMaterial color={region.glowColor} transparent opacity={0.6} />
                            </mesh>
                        </>
                    )}

                    {/* Labels laterais */}
                    {showDetails && (
                        <Text
                            position={[0.6, region.start + region.length / 2, 0]}
                            fontSize={0.1}
                            color={region.glowColor}
                            anchorX="left"
                        >
                            {region.name}
                        </Text>
                    )}
                </group>
            ))}

            {/* Marcadores de direção */}
            <group position={[-0.8, -3, 0]}>
                <Text fontSize={0.12} color="#4ade80" anchorX="center">
                    5'
                </Text>
            </group>
            <group position={[-0.8, 3, 0]}>
                <Text fontSize={0.12} color="#4ade80" anchorX="center">
                    3'
                </Text>
            </group>
            <group position={[0.8, -3, 0]}>
                <Text fontSize={0.12} color="#f87171" anchorX="center">
                    3'
                </Text>
            </group>
            <group position={[0.8, 3, 0]}>
                <Text fontSize={0.12} color="#f87171" anchorX="center">
                    5'
                </Text>
            </group>

            {/* Seta de transcrição */}
            <group position={[0, -3.3, 0]}>
                <mesh rotation={[0, 0, 0]}>
                    <coneGeometry args={[0.1, 0.3, 8]} />
                    <meshStandardMaterial color="#22c55e" emissive="#4ade80" emissiveIntensity={0.5} />
                </mesh>
                <Text position={[0, -0.4, 0]} fontSize={0.1} color="#22c55e" anchorX="center">
                    Direção da Transcrição →
                </Text>
            </group>

            {/* Códons de início e parada (marcadores) */}
            <group position={[0, -1.6, 0.3]}>
                <mesh>
                    <boxGeometry args={[0.15, 0.08, 0.05]} />
                    <meshStandardMaterial color="#22c55e" emissive="#4ade80" emissiveIntensity={0.6} />
                </mesh>
                <Text position={[0.2, 0, 0]} fontSize={0.08} color="#22c55e" anchorX="left">
                    AUG (Start)
                </Text>
            </group>
            <group position={[0, 1.8, 0.3]}>
                <mesh>
                    <boxGeometry args={[0.15, 0.08, 0.05]} />
                    <meshStandardMaterial color="#ef4444" emissive="#f87171" emissiveIntensity={0.6} />
                </mesh>
                <Text position={[0.2, 0, 0]} fontSize={0.08} color="#ef4444" anchorX="left">
                    UAA (Stop)
                </Text>
            </group>

            {/* Tooltip para região hover */}
            {hoveredRegion && (
                <Html position={[1.5, hoveredRegion.start + hoveredRegion.length / 2, 0]} style={{ pointerEvents: 'none' }}>
                    <div style={{
                        background: 'rgba(0,0,0,0.95)',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '12px',
                        minWidth: '160px',
                        border: `2px solid ${hoveredRegion.glowColor}`,
                    }}>
                        <div style={{ 
                            fontWeight: 'bold', 
                            fontSize: '14px', 
                            color: hoveredRegion.glowColor,
                            marginBottom: '6px'
                        }}>
                            {hoveredRegion.name}
                        </div>
                        <div style={{ color: '#e2e8f0', marginBottom: '4px' }}>
                            {hoveredRegion.description}
                        </div>
                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                            Tipo: {hoveredRegion.type === 'exon' ? 'Éxon (codificante)' : 
                                   hoveredRegion.type === 'intron' ? 'Íntron (não codificante)' :
                                   hoveredRegion.type === 'promoter' ? 'Promotor' :
                                   hoveredRegion.type === 'terminator' ? 'Terminador' : 'UTR'}
                        </div>
                    </div>
                </Html>
            )}

            {/* Legenda */}
            <Html position={[-2.5, 0, 0]} style={{ pointerEvents: 'none' }}>
                <div style={{
                    background: 'rgba(0,0,0,0.85)',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '10px',
                    width: '130px',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '11px' }}>
                        📖 Regiões do Gene
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#22c55e' }} />
                        <span>Promotor</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#3b82f6' }} />
                        <span>Éxons</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#6b7280' }} />
                        <span>Íntrons</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#ef4444' }} />
                        <span>Terminador</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#94a3b8' }} />
                        <span>UTR</span>
                    </div>
                </div>
            </Html>

            {/* Partículas ambiente */}
            {Array.from({ length: 30 }).map((_, i) => {
                const angle = (i / 30) * Math.PI * 2
                const radius = 3.5 + Math.random()
                const y = (Math.random() - 0.5) * 8
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
                            color={['#3b82f6', '#22c55e', '#ef4444', '#c084fc'][i % 4]}
                            transparent
                            opacity={0.4}
                        />
                    </mesh>
                )
            })}
        </group>
    )
}

import { useState, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, MeshDistortMaterial, Float } from '@react-three/drei'
import { Group, Vector3, CatmullRomCurve3, Mesh } from 'three'
import type { Gene, Chromosome as ChromosomeType } from '../types'
import { getAlleleBySymbol } from '../data/sample-genes'

interface ChromosomeProps {
    chromosome: ChromosomeType
    genes: Gene[]
    position: [number, number, number]
    onGeneClick?: (geneId: string) => void
}

// Componente para criar uma cromátide com forma orgânica
function Chromatid({ 
    points, 
    color, 
    thickness = 0.15,
    emissiveColor,
    isHovered = false
}: { 
    points: Vector3[]
    color: string
    thickness?: number
    emissiveColor?: string
    isHovered?: boolean
}) {
    const curve = useMemo(() => new CatmullRomCurve3(points), [points])
    
    return (
        <mesh>
            <tubeGeometry args={[curve, 64, thickness, 12, false]} />
            <MeshDistortMaterial
                color={color}
                emissive={emissiveColor || color}
                emissiveIntensity={isHovered ? 0.6 : 0.2}
                roughness={0.4}
                metalness={0.1}
                distort={0.05}
                speed={2}
            />
        </mesh>
    )
}

// Componente para um gene brilhante
function GeneMarker({
    gene,
    allele,
    position,
    isHovered,
    onHover,
    onUnhover,
    onClick
}: {
    gene: Gene
    allele: { symbol: string; name: string; color: string; isDominant: boolean }
    position: Vector3
    isHovered: boolean
    onHover: () => void
    onUnhover: () => void
    onClick: () => void
}) {
    const meshRef = useRef<Mesh>(null)
    
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.scale.setScalar(isHovered ? 1.3 : 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1)
        }
    })

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
            <group position={position}>
                {/* Glow externo */}
                <mesh scale={isHovered ? 1.8 : 1.4}>
                    <sphereGeometry args={[0.12, 16, 16]} />
                    <meshBasicMaterial 
                        color={allele.color} 
                        transparent 
                        opacity={isHovered ? 0.4 : 0.2}
                    />
                </mesh>

                {/* Núcleo do gene */}
                <mesh
                    ref={meshRef}
                    onPointerOver={(e) => { e.stopPropagation(); onHover() }}
                    onPointerOut={onUnhover}
                    onClick={(e) => { e.stopPropagation(); onClick() }}
                >
                    <sphereGeometry args={[0.1, 24, 24]} />
                    <meshStandardMaterial
                        color={allele.color}
                        emissive={allele.color}
                        emissiveIntensity={isHovered ? 1.5 : 0.8}
                        roughness={0.1}
                        metalness={0.6}
                    />
                </mesh>

                {/* Anel orbital */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.16, 0.015, 8, 32]} />
                    <meshBasicMaterial 
                        color={allele.color} 
                        transparent 
                        opacity={isHovered ? 0.9 : 0.5}
                    />
                </mesh>

                {/* Label do alelo */}
                <Html
                    position={[0.25, 0, 0]}
                    center
                    zIndexRange={[0, 50]}
                    style={{ pointerEvents: 'none' }}
                >
                    <div style={{
                        background: `linear-gradient(135deg, ${allele.color}dd, ${allele.color}88)`,
                        color: 'white',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '800',
                        fontFamily: 'monospace',
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                        boxShadow: `0 2px 10px ${allele.color}50`
                    }}>
                        {allele.symbol}
                    </div>
                </Html>

                {/* Tooltip detalhado ao hover */}
                {isHovered && (
                    <Html position={[0, 0.4, 0]} center zIndexRange={[0, 50]} style={{ pointerEvents: 'none' }}>
                        <div style={{
                            background: 'rgba(0, 0, 0, 0.95)',
                            backdropFilter: 'blur(10px)',
                            color: 'white',
                            padding: '14px 18px',
                            borderRadius: '14px',
                            fontSize: '12px',
                            border: `2px solid ${allele.color}`,
                            boxShadow: `0 8px 32px ${allele.color}40`,
                            minWidth: '160px',
                            animation: 'fadeIn 0.2s ease'
                        }}>
                            <div style={{ 
                                fontWeight: '800', 
                                fontSize: '14px',
                                marginBottom: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <div style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: allele.color,
                                    boxShadow: `0 0 12px ${allele.color}`
                                }} />
                                {gene.name}
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginBottom: '6px'
                            }}>
                                <span style={{
                                    fontSize: '20px',
                                    fontFamily: 'monospace',
                                    fontWeight: '900',
                                    color: allele.color
                                }}>
                                    {allele.symbol}
                                </span>
                                <span style={{ color: 'rgba(255,255,255,0.9)' }}>
                                    {allele.name}
                                </span>
                            </div>
                            <div style={{
                                fontSize: '10px',
                                padding: '4px 8px',
                                background: allele.isDominant ? 'rgba(59, 130, 246, 0.3)' : 'rgba(167, 139, 250, 0.3)',
                                borderRadius: '6px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                {allele.isDominant ? '🔷 Dominante' : '🔶 Recessivo'}
                            </div>
                        </div>
                    </Html>
                )}
            </group>
        </Float>
    )
}

export function Chromosome({ chromosome, genes, position, onGeneClick }: ChromosomeProps) {
    const [hoveredGene, setHoveredGene] = useState<string | null>(null)
    const groupRef = useRef<Group>(null)

    // Animação suave
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15
            groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
        }
    })

    // Cores do cromossomo
    const primaryColor = chromosome.isPaternal ? '#4f8ff7' : '#f472b6'
    const secondaryColor = chromosome.isPaternal ? '#2563eb' : '#db2777'
    const glowColor = chromosome.isPaternal ? '#60a5fa' : '#f9a8d4'

    // Pontos para criar as cromátides com forma orgânica (X shape para metáfase)
    const chromatid1Points = useMemo(() => [
        new Vector3(-0.8, 2, 0),
        new Vector3(-0.3, 1.2, 0.1),
        new Vector3(-0.1, 0.5, 0),
        new Vector3(0, 0, 0),
        new Vector3(0.1, -0.5, 0),
        new Vector3(0.3, -1.2, -0.1),
        new Vector3(0.8, -2, 0),
    ], [])

    const chromatid2Points = useMemo(() => [
        new Vector3(0.8, 2, 0),
        new Vector3(0.3, 1.2, -0.1),
        new Vector3(0.1, 0.5, 0),
        new Vector3(0, 0, 0),
        new Vector3(-0.1, -0.5, 0),
        new Vector3(-0.3, -1.2, 0.1),
        new Vector3(-0.8, -2, 0),
    ], [])

    // Calcula posições dos genes ao longo da cromátide
    const genePositions = useMemo(() => {
        return genes.map(gene => {
            const t = gene.locus
            // Interpola ao longo da primeira cromátide
            const idx = Math.floor(t * (chromatid1Points.length - 1))
            const nextIdx = Math.min(idx + 1, chromatid1Points.length - 1)
            const localT = (t * (chromatid1Points.length - 1)) - idx
            
            const p1 = chromatid1Points[idx]
            const p2 = chromatid1Points[nextIdx]
            
            return new Vector3(
                p1.x + (p2.x - p1.x) * localT + 0.25,
                p1.y + (p2.y - p1.y) * localT,
                p1.z + (p2.z - p1.z) * localT + 0.15
            )
        })
    }, [genes, chromatid1Points])

    return (
        <group ref={groupRef} position={position}>
            {/* Glow de fundo */}
            <mesh scale={[2.5, 5, 1]}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial 
                    color={glowColor} 
                    transparent 
                    opacity={0.08}
                />
            </mesh>

            {/* Cromátide 1 */}
            <Chromatid 
                points={chromatid1Points} 
                color={primaryColor}
                emissiveColor={glowColor}
                thickness={0.12}
            />

            {/* Cromátide 2 (irmã) */}
            <Chromatid 
                points={chromatid2Points} 
                color={secondaryColor}
                emissiveColor={glowColor}
                thickness={0.12}
            />

            {/* Centrômero (onde as cromátides se unem) */}
            <group position={[0, 0, 0]}>
                {/* Estrutura do centrômero */}
                <mesh>
                    <torusGeometry args={[0.22, 0.06, 12, 32]} />
                    <meshStandardMaterial
                        color="#22c55e"
                        emissive="#22c55e"
                        emissiveIntensity={0.6}
                        roughness={0.2}
                        metalness={0.4}
                    />
                </mesh>

                {/* Cinetócoros */}
                <mesh position={[0.28, 0, 0]}>
                    <dodecahedronGeometry args={[0.06, 0]} />
                    <meshStandardMaterial
                        color="#f97316"
                        emissive="#f97316"
                        emissiveIntensity={0.8}
                    />
                </mesh>
                <mesh position={[-0.28, 0, 0]}>
                    <dodecahedronGeometry args={[0.06, 0]} />
                    <meshStandardMaterial
                        color="#f97316"
                        emissive="#f97316"
                        emissiveIntensity={0.8}
                    />
                </mesh>

                {/* Proteínas coesinas (conectando as cromátides) */}
                {[-0.8, -0.4, 0.4, 0.8].map((y, i) => (
                    <mesh key={`cohesin-${i}`} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
                        <meshBasicMaterial color="#a855f7" transparent opacity={0.6} />
                    </mesh>
                ))}
            </group>

            {/* Telômeros (extremidades) */}
            {[
                { pos: [-0.8, 2, 0], rot: [0, 0, -0.3] },
                { pos: [0.8, 2, 0], rot: [0, 0, 0.3] },
                { pos: [0.8, -2, 0], rot: [0, 0, -0.3] },
                { pos: [-0.8, -2, 0], rot: [0, 0, 0.3] },
            ].map((t, i) => (
                <mesh key={`telomere-${i}`} position={t.pos as [number, number, number]} rotation={t.rot as [number, number, number]}>
                    <capsuleGeometry args={[0.08, 0.15, 8, 16]} />
                    <meshStandardMaterial
                        color="#fbbf24"
                        emissive="#fbbf24"
                        emissiveIntensity={0.5}
                        roughness={0.2}
                    />
                </mesh>
            ))}

            {/* Genes */}
            {genes.map((gene, index) => {
                const alleleSymbol = chromosome.genes.get(gene.id)
                const allele = alleleSymbol ? getAlleleBySymbol(gene, alleleSymbol) : null

                if (!allele) return null

                return (
                    <GeneMarker
                        key={gene.id}
                        gene={gene}
                        allele={allele}
                        position={genePositions[index]}
                        isHovered={hoveredGene === gene.id}
                        onHover={() => {
                            setHoveredGene(gene.id)
                            document.body.style.cursor = 'pointer'
                        }}
                        onUnhover={() => {
                            setHoveredGene(null)
                            document.body.style.cursor = 'default'
                        }}
                        onClick={() => onGeneClick?.(gene.id)}
                    />
                )
            })}

            {/* Label do tipo de cromossomo */}
            <Html position={[0, -2.8, 0]} center zIndexRange={[0, 50]}>
                <div style={{
                    background: chromosome.isPaternal
                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9))'
                        : 'linear-gradient(135deg, rgba(236, 72, 153, 0.9), rgba(219, 39, 119, 0.9))',
                    color: 'white',
                    padding: '10px 18px',
                    borderRadius: '25px',
                    fontSize: '13px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: chromosome.isPaternal
                        ? '0 4px 20px rgba(59, 130, 246, 0.4)'
                        : '0 4px 20px rgba(236, 72, 153, 0.4)',
                    border: '2px solid rgba(255,255,255,0.3)'
                }}>
                    <span style={{ fontSize: '18px' }}>
                        {chromosome.isPaternal ? '♂️' : '♀️'}
                    </span>
                    <span>Cromossomo {chromosome.isPaternal ? 'Paterno' : 'Materno'}</span>
                </div>
            </Html>

            {/* Indicadores estruturais (apenas visíveis no hover da área) */}
            <Html position={[0.5, 0, 0]} center zIndexRange={[0, 50]} style={{ pointerEvents: 'none' }}>
                <div style={{
                    background: 'rgba(0,0,0,0.75)',
                    color: '#22c55e',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '9px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap'
                }}>
                    Centrômero
                </div>
            </Html>

            <Html position={[-0.8, 2.3, 0]} center zIndexRange={[0, 50]} style={{ pointerEvents: 'none' }}>
                <div style={{
                    background: 'rgba(0,0,0,0.75)',
                    color: '#fbbf24',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '8px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap'
                }}>
                    Telômero
                </div>
            </Html>
        </group>
    )
}

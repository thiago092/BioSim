import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Text, Html } from '@react-three/drei'
import { BASE_COLORS } from '../data/educational-content'

// Estrutura molecular detalhada das bases
interface BaseInfo {
    symbol: string
    name: string
    type: 'purina' | 'pirimidina'
    rings: number
    color: string
    formula: string
    atoms: { C: number, H: number, N: number, O: number }
    hBonds: number
    description: string
}

const BASES_INFO: Record<string, BaseInfo> = {
    A: {
        symbol: 'A',
        name: 'Adenina',
        type: 'purina',
        rings: 2,
        color: BASE_COLORS.A,
        formula: 'C₅H₅N₅',
        atoms: { C: 5, H: 5, N: 5, O: 0 },
        hBonds: 2,
        description: 'Base púrica com dois anéis. Pareia com Timina através de 2 ligações de hidrogênio.'
    },
    T: {
        symbol: 'T',
        name: 'Timina',
        type: 'pirimidina',
        rings: 1,
        color: BASE_COLORS.T,
        formula: 'C₅H₆N₂O₂',
        atoms: { C: 5, H: 6, N: 2, O: 2 },
        hBonds: 2,
        description: 'Base pirimídica exclusiva do DNA. Pareia com Adenina através de 2 ligações de hidrogênio.'
    },
    C: {
        symbol: 'C',
        name: 'Citosina',
        type: 'pirimidina',
        rings: 1,
        color: BASE_COLORS.C,
        formula: 'C₄H₅N₃O',
        atoms: { C: 4, H: 5, N: 3, O: 1 },
        hBonds: 3,
        description: 'Base pirimídica. Pareia com Guanina através de 3 ligações de hidrogênio (mais forte).'
    },
    G: {
        symbol: 'G',
        name: 'Guanina',
        type: 'purina',
        rings: 2,
        color: BASE_COLORS.G,
        formula: 'C₅H₅N₅O',
        atoms: { C: 5, H: 5, N: 5, O: 1 },
        hBonds: 3,
        description: 'Base púrica com dois anéis. Pareia com Citosina através de 3 ligações de hidrogênio.'
    }
}

// Componente para estrutura molecular de purina (2 anéis)
function PurineStructure({ color, glowIntensity }: { color: string, glowIntensity: number }) {
    return (
        <group>
            {/* Anel hexagonal (pirimidina) */}
            {Array.from({ length: 6 }).map((_, i) => {
                const angle = (i / 6) * Math.PI * 2
                const x = Math.cos(angle) * 0.25
                const y = Math.sin(angle) * 0.25
                return (
                    <mesh key={`hex-${i}`} position={[x - 0.15, y, 0]}>
                        <sphereGeometry args={[0.08, 16, 16]} />
                        <meshStandardMaterial
                            color={color}
                            emissive={color}
                            emissiveIntensity={glowIntensity}
                        />
                    </mesh>
                )
            })}
            {/* Anel pentagonal (imidazol) */}
            {Array.from({ length: 5 }).map((_, i) => {
                const angle = (i / 5) * Math.PI * 2 - Math.PI / 2
                const x = Math.cos(angle) * 0.2
                const y = Math.sin(angle) * 0.2
                return (
                    <mesh key={`pent-${i}`} position={[x + 0.25, y, 0]}>
                        <sphereGeometry args={[0.07, 16, 16]} />
                        <meshStandardMaterial
                            color={color}
                            emissive={color}
                            emissiveIntensity={glowIntensity * 0.8}
                        />
                    </mesh>
                )
            })}
            {/* Conexões entre átomos */}
            <mesh position={[0, 0, 0]}>
                <torusGeometry args={[0.25, 0.02, 8, 6]} />
                <meshBasicMaterial color={color} transparent opacity={0.6} />
            </mesh>
            <mesh position={[0.25, 0, 0]}>
                <torusGeometry args={[0.2, 0.02, 8, 5]} />
                <meshBasicMaterial color={color} transparent opacity={0.6} />
            </mesh>
        </group>
    )
}

// Componente para estrutura molecular de pirimidina (1 anel)
function PyrimidineStructure({ color, glowIntensity }: { color: string, glowIntensity: number }) {
    return (
        <group>
            {/* Anel hexagonal único */}
            {Array.from({ length: 6 }).map((_, i) => {
                const angle = (i / 6) * Math.PI * 2
                const x = Math.cos(angle) * 0.28
                const y = Math.sin(angle) * 0.28
                return (
                    <mesh key={`hex-${i}`} position={[x, y, 0]}>
                        <sphereGeometry args={[0.09, 16, 16]} />
                        <meshStandardMaterial
                            color={color}
                            emissive={color}
                            emissiveIntensity={glowIntensity}
                        />
                    </mesh>
                )
            })}
            {/* Conexões entre átomos */}
            <mesh position={[0, 0, 0]}>
                <torusGeometry args={[0.28, 0.025, 8, 6]} />
                <meshBasicMaterial color={color} transparent opacity={0.6} />
            </mesh>
        </group>
    )
}

// Componente para um par de bases
function BasePair({ 
    base1, 
    base2, 
    position, 
    onHover,
    isHovered 
}: { 
    base1: string
    base2: string
    position: [number, number, number]
    onHover: (base: string | null) => void
    isHovered: string | null
}) {
    const info1 = BASES_INFO[base1]
    const info2 = BASES_INFO[base2]
    const hBonds = info1.hBonds

    return (
        <group position={position}>
            {/* Base 1 (esquerda) */}
            <group 
                position={[-0.8, 0, 0]}
                onPointerEnter={() => onHover(base1)}
                onPointerLeave={() => onHover(null)}
            >
                {info1.type === 'purina' ? (
                    <PurineStructure color={info1.color} glowIntensity={isHovered === base1 ? 0.9 : 0.5} />
                ) : (
                    <PyrimidineStructure color={info1.color} glowIntensity={isHovered === base1 ? 0.9 : 0.5} />
                )}
                
                {/* Label da base */}
                <Text
                    position={[0, -0.6, 0]}
                    fontSize={0.25}
                    color={info1.color}
                    anchorX="center"
                    fontWeight="bold"
                >
                    {info1.symbol}
                </Text>
                <Text
                    position={[0, -0.9, 0]}
                    fontSize={0.12}
                    color="#94a3b8"
                    anchorX="center"
                >
                    {info1.name}
                </Text>
                <Text
                    position={[0, -1.1, 0]}
                    fontSize={0.08}
                    color="#64748b"
                    anchorX="center"
                >
                    ({info1.type === 'purina' ? 'Purina - 2 anéis' : 'Pirimidina - 1 anel'})
                </Text>
            </group>

            {/* Base 2 (direita) */}
            <group 
                position={[0.8, 0, 0]}
                onPointerEnter={() => onHover(base2)}
                onPointerLeave={() => onHover(null)}
            >
                {info2.type === 'purina' ? (
                    <PurineStructure color={info2.color} glowIntensity={isHovered === base2 ? 0.9 : 0.5} />
                ) : (
                    <PyrimidineStructure color={info2.color} glowIntensity={isHovered === base2 ? 0.9 : 0.5} />
                )}
                
                <Text
                    position={[0, -0.6, 0]}
                    fontSize={0.25}
                    color={info2.color}
                    anchorX="center"
                    fontWeight="bold"
                >
                    {info2.symbol}
                </Text>
                <Text
                    position={[0, -0.9, 0]}
                    fontSize={0.12}
                    color="#94a3b8"
                    anchorX="center"
                >
                    {info2.name}
                </Text>
                <Text
                    position={[0, -1.1, 0]}
                    fontSize={0.08}
                    color="#64748b"
                    anchorX="center"
                >
                    ({info2.type === 'purina' ? 'Purina - 2 anéis' : 'Pirimidina - 1 anel'})
                </Text>
            </group>

            {/* Ligações de hidrogênio */}
            {Array.from({ length: hBonds }).map((_, i) => {
                const yOffset = (i - (hBonds - 1) / 2) * 0.15
                return (
                    <group key={`hbond-${i}`}>
                        <mesh position={[0, yOffset, 0]} rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.025, 0.025, 1.0, 12]} />
                            <meshStandardMaterial
                                color="#ffffff"
                                emissive="#ffffff"
                                emissiveIntensity={0.4}
                                transparent
                                opacity={0.7}
                            />
                        </mesh>
                        {/* Pontos nas extremidades */}
                        <mesh position={[-0.45, yOffset, 0]}>
                            <sphereGeometry args={[0.04, 12, 12]} />
                            <meshBasicMaterial color="#ffffff" />
                        </mesh>
                        <mesh position={[0.45, yOffset, 0]}>
                            <sphereGeometry args={[0.04, 12, 12]} />
                            <meshBasicMaterial color="#ffffff" />
                        </mesh>
                    </group>
                )
            })}

            {/* Indicador de número de ligações */}
            <Text
                position={[0, 0.5, 0]}
                fontSize={0.1}
                color="#ffffff"
                anchorX="center"
            >
                {hBonds} ligações de H
            </Text>
        </group>
    )
}

export function BasesPairView() {
    const groupRef = useRef<Group>(null)
    const [hoveredBase, setHoveredBase] = useState<string | null>(null)

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.15
        }
    })

    return (
        <group ref={groupRef}>
            {/* Título */}
            <Text
                position={[0, 3, 0]}
                fontSize={0.35}
                color="#ffffff"
                anchorX="center"
            >
                ⚛️ BASES NITROGENADAS
            </Text>
            <Text
                position={[0, 2.6, 0]}
                fontSize={0.16}
                color="#94a3b8"
                anchorX="center"
            >
                Pareamento específico A-T e C-G (Regra de Chargaff)
            </Text>

            {/* Par A-T */}
            <group position={[-1.8, 0.5, 0]}>
                <Text
                    position={[0, 1.5, 0]}
                    fontSize={0.2}
                    color="#ffffff"
                    anchorX="center"
                >
                    Par A-T
                </Text>
                <Text
                    position={[0, 1.2, 0]}
                    fontSize={0.1}
                    color="#f87171"
                    anchorX="center"
                >
                    Ligação mais fraca (2H)
                </Text>
                <BasePair 
                    base1="A" 
                    base2="T" 
                    position={[0, 0, 0]}
                    onHover={setHoveredBase}
                    isHovered={hoveredBase}
                />
            </group>

            {/* Par C-G */}
            <group position={[1.8, 0.5, 0]}>
                <Text
                    position={[0, 1.5, 0]}
                    fontSize={0.2}
                    color="#ffffff"
                    anchorX="center"
                >
                    Par C-G
                </Text>
                <Text
                    position={[0, 1.2, 0]}
                    fontSize={0.1}
                    color="#4ade80"
                    anchorX="center"
                >
                    Ligação mais forte (3H)
                </Text>
                <BasePair 
                    base1="C" 
                    base2="G" 
                    position={[0, 0, 0]}
                    onHover={setHoveredBase}
                    isHovered={hoveredBase}
                />
            </group>

            {/* Tooltip detalhado */}
            {hoveredBase && BASES_INFO[hoveredBase] && (
                <Html position={[0, -2, 2]} style={{ pointerEvents: 'none' }}>
                    <div style={{
                        background: 'rgba(0,0,0,0.95)',
                        padding: '16px 20px',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '12px',
                        minWidth: '220px',
                        border: `2px solid ${BASES_INFO[hoveredBase].color}`,
                        textAlign: 'center'
                    }}>
                        <div style={{ 
                            fontSize: '24px', 
                            fontWeight: 'bold',
                            color: BASES_INFO[hoveredBase].color,
                            marginBottom: '8px'
                        }}>
                            {BASES_INFO[hoveredBase].symbol} - {BASES_INFO[hoveredBase].name}
                        </div>
                        <div style={{ 
                            fontSize: '14px', 
                            color: '#94a3b8',
                            marginBottom: '10px'
                        }}>
                            {BASES_INFO[hoveredBase].type === 'purina' ? '🔵 PURINA (2 anéis)' : '🟡 PIRIMIDINA (1 anel)'}
                        </div>
                        <div style={{ 
                            fontSize: '11px',
                            color: '#e2e8f0',
                            marginBottom: '10px',
                            lineHeight: '1.5'
                        }}>
                            {BASES_INFO[hoveredBase].description}
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '8px',
                            fontSize: '10px',
                            background: 'rgba(255,255,255,0.1)',
                            padding: '10px',
                            borderRadius: '8px'
                        }}>
                            <div>
                                <strong style={{ color: BASES_INFO[hoveredBase].color }}>Fórmula:</strong>
                                <div>{BASES_INFO[hoveredBase].formula}</div>
                            </div>
                            <div>
                                <strong style={{ color: BASES_INFO[hoveredBase].color }}>Ligações H:</strong>
                                <div>{BASES_INFO[hoveredBase].hBonds}</div>
                            </div>
                        </div>
                    </div>
                </Html>
            )}

            {/* Info box - Regra de Chargaff */}
            <Html position={[0, -2.5, 0]} style={{ pointerEvents: 'none' }}>
                <div style={{
                    background: 'rgba(0,0,0,0.85)',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '12px',
                    textAlign: 'center',
                    border: '1px solid rgba(255,255,255,0.2)',
                    maxWidth: '350px'
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#fbbf24' }}>
                        📊 Regra de Chargaff
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '8px' }}>
                        <div>
                            <span style={{ color: BASE_COLORS.A }}>%A</span> = <span style={{ color: BASE_COLORS.T }}>%T</span>
                        </div>
                        <div>
                            <span style={{ color: BASE_COLORS.C }}>%C</span> = <span style={{ color: BASE_COLORS.G }}>%G</span>
                        </div>
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                        A quantidade de adenina sempre é igual à de timina, e citosina igual a guanina.
                    </div>
                </div>
            </Html>

            {/* Partículas ambiente */}
            {Array.from({ length: 40 }).map((_, i) => {
                const angle = (i / 40) * Math.PI * 2
                const radius = 5 + Math.random() * 1.5
                const y = (Math.random() - 0.5) * 6
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
                            color={Object.values(BASE_COLORS)[i % 4]}
                            transparent
                            opacity={0.35}
                        />
                    </mesh>
                )
            })}
        </group>
    )
}

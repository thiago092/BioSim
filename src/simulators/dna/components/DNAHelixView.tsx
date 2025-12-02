import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Text, Html } from '@react-three/drei'
import { BASE_COLORS } from '../data/educational-content'

// Sequência de DNA mais longa para visualização mais completa
const DNA_SEQUENCE = ['A', 'T', 'G', 'C', 'A', 'A', 'T', 'G', 'C', 'G', 'T', 'A', 'C', 'G', 'A', 'T', 'G', 'C', 'A', 'T']
const COMPLEMENT: Record<string, string> = { A: 'T', T: 'A', C: 'G', G: 'C' }

const BASE_NAMES: Record<string, string> = {
    A: 'Adenina',
    T: 'Timina',
    C: 'Citosina',
    G: 'Guanina'
}

// Componente para desenhar grupo fosfato
function PhosphateGroup({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) {
    return (
        <group position={position} rotation={rotation}>
            <mesh>
                <tetrahedronGeometry args={[0.06, 0]} />
                <meshStandardMaterial
                    color="#f97316"
                    emissive="#fb923c"
                    emissiveIntensity={0.5}
                    metalness={0.3}
                    roughness={0.4}
                />
            </mesh>
        </group>
    )
}

// Componente para açúcar (desoxirribose)
function SugarMolecule({ position }: { position: [number, number, number] }) {
    return (
        <mesh position={position}>
            <dodecahedronGeometry args={[0.05, 0]} />
            <meshStandardMaterial
                color="#818cf8"
                emissive="#6366f1"
                emissiveIntensity={0.4}
                metalness={0.2}
                roughness={0.5}
            />
        </mesh>
    )
}

export function DNAHelixView() {
    const helixRef = useRef<Group>(null)
    const [hoveredBase, setHoveredBase] = useState<{ base: string, index: number } | null>(null)

    useFrame((state) => {
        if (helixRef.current) {
            helixRef.current.rotation.y = state.clock.elapsedTime * 0.12
        }
    })

    const helixData = useMemo(() => {
        return DNA_SEQUENCE.map((base, i) => {
            const angle = (i / DNA_SEQUENCE.length) * Math.PI * 6 // Mais voltas
            const y = (i / DNA_SEQUENCE.length) * 8 - 4
            const radius = 1
            const complement = COMPLEMENT[base]
            
            return {
                base,
                complement,
                index: i,
                angle,
                y,
                leftPos: {
                    backbone: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius] as [number, number, number],
                    base: [Math.cos(angle) * (radius * 0.55), 0, Math.sin(angle) * (radius * 0.55)] as [number, number, number],
                },
                rightPos: {
                    backbone: [Math.cos(angle + Math.PI) * radius, 0, Math.sin(angle + Math.PI) * radius] as [number, number, number],
                    base: [Math.cos(angle + Math.PI) * (radius * 0.55), 0, Math.sin(angle + Math.PI) * (radius * 0.55)] as [number, number, number],
                }
            }
        })
    }, [])

    return (
        <group ref={helixRef}>
            {/* Título */}
            <Text
                position={[0, 5, 0]}
                fontSize={0.35}
                color="#ffffff"
                anchorX="center"
            >
                🔬 DUPLA HÉLICE DO DNA
            </Text>
            <Text
                position={[0, 4.6, 0]}
                fontSize={0.16}
                color="#94a3b8"
                anchorX="center"
            >
                Estrutura descoberta por Watson & Crick (1953)
            </Text>

            {/* Indicadores de direção */}
            <Text position={[-1.5, 4, 0]} fontSize={0.15} color="#4ade80" anchorX="center">
                5' →
            </Text>
            <Text position={[1.5, 4, 0]} fontSize={0.15} color="#f87171" anchorX="center">
                ← 3'
            </Text>
            <Text position={[-1.5, -4.3, 0]} fontSize={0.15} color="#4ade80" anchorX="center">
                ← 3'
            </Text>
            <Text position={[1.5, -4.3, 0]} fontSize={0.15} color="#f87171" anchorX="center">
                5' →
            </Text>

            {helixData.map((data, i) => (
                <group key={i} position={[0, data.y, 0]}>
                    {/* Backbone esquerdo (açúcar-fosfato) */}
                    <PhosphateGroup position={data.leftPos.backbone} />
                    <SugarMolecule position={[
                        data.leftPos.backbone[0] * 0.85,
                        0,
                        data.leftPos.backbone[2] * 0.85
                    ]} />

                    {/* Base nitrogenada esquerda */}
                    <mesh
                        position={data.leftPos.base}
                        onPointerEnter={() => setHoveredBase({ base: data.base, index: i })}
                        onPointerLeave={() => setHoveredBase(null)}
                    >
                        <sphereGeometry args={[0.14, 24, 24]} />
                        <meshStandardMaterial
                            color={BASE_COLORS[data.base as keyof typeof BASE_COLORS]}
                            emissive={BASE_COLORS[data.base as keyof typeof BASE_COLORS]}
                            emissiveIntensity={hoveredBase?.index === i ? 0.9 : 0.5}
                            metalness={0.3}
                            roughness={0.4}
                        />
                    </mesh>

                    {/* Backbone direito (açúcar-fosfato) */}
                    <PhosphateGroup position={data.rightPos.backbone} />
                    <SugarMolecule position={[
                        data.rightPos.backbone[0] * 0.85,
                        0,
                        data.rightPos.backbone[2] * 0.85
                    ]} />

                    {/* Base nitrogenada direita (complementar) */}
                    <mesh
                        position={data.rightPos.base}
                        onPointerEnter={() => setHoveredBase({ base: data.complement, index: i })}
                        onPointerLeave={() => setHoveredBase(null)}
                    >
                        <sphereGeometry args={[0.14, 24, 24]} />
                        <meshStandardMaterial
                            color={BASE_COLORS[data.complement as keyof typeof BASE_COLORS]}
                            emissive={BASE_COLORS[data.complement as keyof typeof BASE_COLORS]}
                            emissiveIntensity={hoveredBase?.index === i ? 0.9 : 0.5}
                            metalness={0.3}
                            roughness={0.4}
                        />
                    </mesh>

                    {/* Ligações de hidrogênio entre bases */}
                    {(data.base === 'A' || data.base === 'T') ? (
                        // A-T: 2 ligações de hidrogênio
                        <>
                            <mesh position={[0, 0.04, 0]} rotation={[0, data.angle, Math.PI / 2]}>
                                <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
                                <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
                            </mesh>
                            <mesh position={[0, -0.04, 0]} rotation={[0, data.angle, Math.PI / 2]}>
                                <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
                                <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
                            </mesh>
                        </>
                    ) : (
                        // C-G: 3 ligações de hidrogênio
                        <>
                            <mesh position={[0, 0.06, 0]} rotation={[0, data.angle, Math.PI / 2]}>
                                <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
                                <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
                            </mesh>
                            <mesh position={[0, 0, 0]} rotation={[0, data.angle, Math.PI / 2]}>
                                <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
                                <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
                            </mesh>
                            <mesh position={[0, -0.06, 0]} rotation={[0, data.angle, Math.PI / 2]}>
                                <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
                                <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
                            </mesh>
                        </>
                    )}

                    {/* Conexões do backbone (entre nucleotídeos) */}
                    {i < helixData.length - 1 && (
                        <>
                            {/* Backbone esquerdo */}
                            <mesh
                                position={[
                                    data.leftPos.backbone[0],
                                    0.2,
                                    data.leftPos.backbone[2],
                                ]}
                            >
                                <cylinderGeometry args={[0.025, 0.025, 0.4, 8]} />
                                <meshStandardMaterial
                                    color="#94a3b8"
                                    emissive="#64748b"
                                    emissiveIntensity={0.2}
                                />
                            </mesh>

                            {/* Backbone direito */}
                            <mesh
                                position={[
                                    data.rightPos.backbone[0],
                                    0.2,
                                    data.rightPos.backbone[2],
                                ]}
                            >
                                <cylinderGeometry args={[0.025, 0.025, 0.4, 8]} />
                                <meshStandardMaterial
                                    color="#94a3b8"
                                    emissive="#64748b"
                                    emissiveIntensity={0.2}
                                />
                            </mesh>
                        </>
                    )}

                    {/* Labels das bases (apenas algumas) */}
                    {i % 5 === 0 && (
                        <>
                            <Text
                                position={[data.leftPos.base[0] - 0.3, 0, data.leftPos.base[2]]}
                                fontSize={0.12}
                                color={BASE_COLORS[data.base as keyof typeof BASE_COLORS]}
                                anchorX="right"
                            >
                                {data.base}
                            </Text>
                            <Text
                                position={[data.rightPos.base[0] + 0.3, 0, data.rightPos.base[2]]}
                                fontSize={0.12}
                                color={BASE_COLORS[data.complement as keyof typeof BASE_COLORS]}
                                anchorX="left"
                            >
                                {data.complement}
                            </Text>
                        </>
                    )}
                </group>
            ))}

            {/* Tooltip para base hover */}
            {hoveredBase && (
                <Html position={[0, 0, 2]} style={{ pointerEvents: 'none' }}>
                    <div style={{
                        background: 'rgba(0,0,0,0.9)',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        color: BASE_COLORS[hoveredBase.base as keyof typeof BASE_COLORS],
                        fontSize: '13px',
                        fontWeight: 'bold',
                        border: `2px solid ${BASE_COLORS[hoveredBase.base as keyof typeof BASE_COLORS]}`,
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '18px', marginBottom: '4px' }}>
                            {hoveredBase.base}
                        </div>
                        <div style={{ color: 'white', fontWeight: 'normal' }}>
                            {BASE_NAMES[hoveredBase.base]}
                        </div>
                        <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>
                            {hoveredBase.base === 'A' || hoveredBase.base === 'G' ? 'Purina (2 anéis)' : 'Pirimidina (1 anel)'}
                        </div>
                    </div>
                </Html>
            )}

            {/* Legenda */}
            <Html position={[2.5, 0, 0]} style={{ pointerEvents: 'none' }}>
                <div style={{
                    background: 'rgba(0,0,0,0.85)',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '11px',
                    width: '140px',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '12px' }}>
                        🎨 Legenda
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: BASE_COLORS.A }} />
                        <span>Adenina (A)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: BASE_COLORS.T }} />
                        <span>Timina (T)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: BASE_COLORS.C }} />
                        <span>Citosina (C)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: BASE_COLORS.G }} />
                        <span>Guanina (G)</span>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '8px', fontSize: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <div style={{ width: '10px', height: '10px', background: '#f97316' }} />
                            <span>Fosfato</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '10px', height: '10px', background: '#818cf8', borderRadius: '50%' }} />
                            <span>Desoxirribose</span>
                        </div>
                    </div>
                </div>
            </Html>

            {/* Partículas ambiente */}
            {Array.from({ length: 50 }).map((_, i) => {
                const angle = (i / 50) * Math.PI * 2
                const radius = 3 + Math.random() * 2
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
                        <sphereGeometry args={[0.02, 8, 8]} />
                        <meshBasicMaterial
                            color={Object.values(BASE_COLORS)[i % 4]}
                            transparent
                            opacity={0.3}
                        />
                    </mesh>
                )
            })}
        </group>
    )
}

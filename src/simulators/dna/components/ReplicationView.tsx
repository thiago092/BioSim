import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Html } from '@react-three/drei'
import { BASE_COLORS, STRUCTURE_COLORS } from '../data/educational-content'

interface ReplicationViewProps {
    speed?: number
    onSelectElement?: (element: string) => void
}

const DNA_SEQUENCE = ['A', 'T', 'G', 'C', 'A', 'A', 'T', 'G', 'C', 'G', 'T', 'A', 'C', 'G', 'A', 'T']
const COMPLEMENT: Record<string, string> = { A: 'T', T: 'A', C: 'G', G: 'C' }

export function ReplicationView({ speed = 1, onSelectElement }: ReplicationViewProps) {
    const groupRef = useRef<Group>(null)
    const [replicationProgress, setReplicationProgress] = useState(0)
    const [hoveredElement, setHoveredElement] = useState<string | null>(null)

    useFrame((state, delta) => {
        setReplicationProgress((prev) => {
            const newProgress = prev + delta * 0.08 * speed
            return newProgress > 1 ? 0 : newProgress
        })

        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
        }
    })

    const replicationForkPosition = useMemo(() => {
        return replicationProgress * DNA_SEQUENCE.length
    }, [replicationProgress])

    const helicaseY = useMemo(() => {
        return (replicationForkPosition / DNA_SEQUENCE.length) * 8 - 4
    }, [replicationForkPosition])

    return (
        <group ref={groupRef}>
            {/* Título */}
            <Html position={[0, 5.5, 0]} center style={{ pointerEvents: 'none' }}>
                <div style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    textShadow: '0 0 10px rgba(0,0,0,0.5)',
                    whiteSpace: 'nowrap'
                }}>
                    🔄 REPLICAÇÃO DO DNA
                </div>
            </Html>

            <Html position={[0, 5, 0]} center style={{ pointerEvents: 'none' }}>
                <div style={{
                    color: '#94a3b8',
                    fontSize: '14px',
                    textAlign: 'center',
                    whiteSpace: 'nowrap'
                }}>
                    Duplicação semiconservativa do material genético
                </div>
            </Html>

            {/* DNA Original não replicado */}
            {DNA_SEQUENCE.map((base, i) => {
                const y = (i / DNA_SEQUENCE.length) * 8 - 4
                const isReplicated = i < replicationForkPosition
                const separation = isReplicated ? 1.2 : 0

                return (
                    <group key={`original-${i}`} position={[-separation, y, 0]}>
                        {/* Backbone esquerdo */}
                        <mesh position={[-0.5, 0, 0]}>
                            <sphereGeometry args={[0.1, 16, 16]} />
                            <meshStandardMaterial
                                color={STRUCTURE_COLORS.backbone}
                                emissive={STRUCTURE_COLORS.backbone}
                                emissiveIntensity={0.2}
                            />
                        </mesh>

                        {/* Base original esquerda */}
                        <mesh position={[-0.25, 0, 0]}>
                            <sphereGeometry args={[0.15, 16, 16]} />
                            <meshStandardMaterial
                                color={BASE_COLORS[base as keyof typeof BASE_COLORS]}
                                emissive={BASE_COLORS[base as keyof typeof BASE_COLORS]}
                                emissiveIntensity={0.5}
                            />
                        </mesh>

                        {/* Parte não replicada - mostra fita dupla unida */}
                        {!isReplicated && (
                            <>
                                {/* Base complementar direita */}
                                <mesh position={[0.25, 0, 0]}>
                                    <sphereGeometry args={[0.15, 16, 16]} />
                                    <meshStandardMaterial
                                        color={BASE_COLORS[COMPLEMENT[base] as keyof typeof BASE_COLORS]}
                                        emissive={BASE_COLORS[COMPLEMENT[base] as keyof typeof BASE_COLORS]}
                                        emissiveIntensity={0.5}
                                    />
                                </mesh>

                                {/* Ligação de hidrogênio */}
                                <mesh rotation={[0, 0, Math.PI / 2]}>
                                    <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
                                    <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
                                </mesh>

                                {/* Backbone direito */}
                                <mesh position={[0.5, 0, 0]}>
                                    <sphereGeometry args={[0.1, 16, 16]} />
                                    <meshStandardMaterial
                                        color={STRUCTURE_COLORS.backbone}
                                        emissive={STRUCTURE_COLORS.backbone}
                                        emissiveIntensity={0.2}
                                    />
                                </mesh>

                                {/* Conexões verticais do backbone */}
                                {i < DNA_SEQUENCE.length - 1 && (
                                    <>
                                        <mesh position={[-0.5, 0.25, 0]}>
                                            <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
                                            <meshStandardMaterial color={STRUCTURE_COLORS.backbone} />
                                        </mesh>
                                        <mesh position={[0.5, 0.25, 0]}>
                                            <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
                                            <meshStandardMaterial color={STRUCTURE_COLORS.backbone} />
                                        </mesh>
                                    </>
                                )}
                            </>
                        )}
                    </group>
                )
            })}

            {/* Nova fita complementar ESQUERDA (fita líder) */}
            {DNA_SEQUENCE.map((base, i) => {
                const y = (i / DNA_SEQUENCE.length) * 8 - 4
                const isReplicated = i < replicationForkPosition

                if (!isReplicated) return null

                return (
                    <group key={`new-left-${i}`} position={[-1.2, y, 0]}>
                        {/* Nova base complementar sintetizada */}
                        <mesh position={[0.25, 0, 0]}>
                            <sphereGeometry args={[0.15, 16, 16]} />
                            <meshStandardMaterial
                                color={BASE_COLORS[COMPLEMENT[base] as keyof typeof BASE_COLORS]}
                                emissive={BASE_COLORS[COMPLEMENT[base] as keyof typeof BASE_COLORS]}
                                emissiveIntensity={0.8}
                            />
                        </mesh>

                        {/* Novo backbone (verde = fita líder) */}
                        <mesh position={[0.5, 0, 0]}>
                            <sphereGeometry args={[0.1, 16, 16]} />
                            <meshStandardMaterial
                                color="#22c55e"
                                emissive="#22c55e"
                                emissiveIntensity={0.5}
                            />
                        </mesh>

                        {/* Ligação de hidrogênio */}
                        <mesh rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
                            <meshBasicMaterial color="#22c55e" transparent opacity={0.8} />
                        </mesh>

                        {/* Conexão vertical */}
                        {i > 0 && (
                            <mesh position={[0.5, -0.25, 0]}>
                                <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
                                <meshStandardMaterial color="#22c55e" />
                            </mesh>
                        )}
                    </group>
                )
            })}

            {/* Fita original DIREITA separada + nova fita complementar (retardada) */}
            {DNA_SEQUENCE.map((base, i) => {
                const y = (i / DNA_SEQUENCE.length) * 8 - 4
                const isReplicated = i < replicationForkPosition

                if (!isReplicated) return null

                return (
                    <group key={`right-duplex-${i}`} position={[1.2, y, 0]}>
                        {/* Base original (que era a complementar) */}
                        <mesh position={[-0.25, 0, 0]}>
                            <sphereGeometry args={[0.15, 16, 16]} />
                            <meshStandardMaterial
                                color={BASE_COLORS[COMPLEMENT[base] as keyof typeof BASE_COLORS]}
                                emissive={BASE_COLORS[COMPLEMENT[base] as keyof typeof BASE_COLORS]}
                                emissiveIntensity={0.5}
                            />
                        </mesh>

                        {/* Backbone original */}
                        <mesh position={[-0.5, 0, 0]}>
                            <sphereGeometry args={[0.1, 16, 16]} />
                            <meshStandardMaterial
                                color={STRUCTURE_COLORS.backbone}
                                emissive={STRUCTURE_COLORS.backbone}
                                emissiveIntensity={0.2}
                            />
                        </mesh>

                        {/* Nova base sintetizada */}
                        <mesh position={[0.25, 0, 0]}>
                            <sphereGeometry args={[0.15, 16, 16]} />
                            <meshStandardMaterial
                                color={BASE_COLORS[base as keyof typeof BASE_COLORS]}
                                emissive={BASE_COLORS[base as keyof typeof BASE_COLORS]}
                                emissiveIntensity={0.8}
                            />
                        </mesh>

                        {/* Novo backbone (azul = fita retardada) */}
                        <mesh position={[0.5, 0, 0]}>
                            <sphereGeometry args={[0.1, 16, 16]} />
                            <meshStandardMaterial
                                color="#3b82f6"
                                emissive="#3b82f6"
                                emissiveIntensity={0.5}
                            />
                        </mesh>

                        {/* Ligação de hidrogênio */}
                        <mesh rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
                            <meshBasicMaterial color="#3b82f6" transparent opacity={0.8} />
                        </mesh>

                        {/* Conexões verticais */}
                        {i > 0 && (
                            <>
                                <mesh position={[-0.5, -0.25, 0]}>
                                    <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
                                    <meshStandardMaterial color={STRUCTURE_COLORS.backbone} />
                                </mesh>
                                <mesh position={[0.5, -0.25, 0]}>
                                    <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
                                    <meshStandardMaterial color="#3b82f6" />
                                </mesh>
                            </>
                        )}
                    </group>
                )
            })}

            {/* HELICASE - Enzima que abre a dupla hélice */}
            <group position={[0, helicaseY, 0]}>
                <mesh
                    onPointerEnter={() => setHoveredElement('helicase')}
                    onPointerLeave={() => setHoveredElement(null)}
                    onClick={() => onSelectElement?.('helicase')}
                >
                    <torusGeometry args={[0.6, 0.18, 16, 32]} />
                    <meshStandardMaterial
                        color={STRUCTURE_COLORS.helicase}
                        emissive={STRUCTURE_COLORS.helicase}
                        emissiveIntensity={hoveredElement === 'helicase' ? 1.2 : 0.7}
                        metalness={0.6}
                        roughness={0.2}
                    />
                </mesh>

                {/* Efeito de brilho pulsante */}
                <mesh>
                    <torusGeometry args={[0.7, 0.05, 16, 32]} />
                    <meshBasicMaterial
                        color={STRUCTURE_COLORS.helicase}
                        transparent
                        opacity={0.3}
                    />
                </mesh>

                <Html position={[1.3, 0, 0]} style={{ pointerEvents: 'none' }}>
                    <div style={{
                        background: 'rgba(0,0,0,0.95)',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        color: STRUCTURE_COLORS.helicase,
                        fontSize: '13px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        border: `2px solid ${STRUCTURE_COLORS.helicase}`,
                        boxShadow: `0 0 15px ${STRUCTURE_COLORS.helicase}`
                    }}>
                        🔓 HELICASE
                        <div style={{ fontSize: '10px', fontWeight: 'normal', color: '#e2e8f0' }}>
                            Desenrola e separa as fitas
                        </div>
                    </div>
                </Html>
            </group>

            {/* DNA POLIMERASE III - Fita líder */}
            <group position={[-1.2, helicaseY - 0.8, 0.4]}>
                <mesh
                    onPointerEnter={() => setHoveredElement('pol-leader')}
                    onPointerLeave={() => setHoveredElement(null)}
                    onClick={() => onSelectElement?.('polymerase')}
                >
                    <dodecahedronGeometry args={[0.3, 0]} />
                    <meshStandardMaterial
                        color={STRUCTURE_COLORS.polymerase}
                        emissive={STRUCTURE_COLORS.polymerase}
                        emissiveIntensity={hoveredElement === 'pol-leader' ? 1 : 0.6}
                        metalness={0.5}
                        roughness={0.3}
                    />
                </mesh>
                <Html position={[0.6, 0, 0]} style={{ pointerEvents: 'none' }}>
                    <div style={{
                        background: 'rgba(0,0,0,0.9)',
                        padding: '5px 8px',
                        borderRadius: '5px',
                        color: STRUCTURE_COLORS.polymerase,
                        fontSize: '11px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap'
                    }}>
                        ✏️ DNA Pol III
                    </div>
                </Html>
            </group>

            {/* DNA POLIMERASE III - Fita retardada */}
            <group position={[1.2, helicaseY - 1, 0.4]}>
                <mesh
                    onPointerEnter={() => setHoveredElement('pol-lagging')}
                    onPointerLeave={() => setHoveredElement(null)}
                    onClick={() => onSelectElement?.('polymerase')}
                >
                    <dodecahedronGeometry args={[0.3, 0]} />
                    <meshStandardMaterial
                        color={STRUCTURE_COLORS.polymerase}
                        emissive={STRUCTURE_COLORS.polymerase}
                        emissiveIntensity={hoveredElement === 'pol-lagging' ? 1 : 0.6}
                        metalness={0.5}
                        roughness={0.3}
                    />
                </mesh>
                <Html position={[0.6, 0, 0]} style={{ pointerEvents: 'none' }}>
                    <div style={{
                        background: 'rgba(0,0,0,0.9)',
                        padding: '5px 8px',
                        borderRadius: '5px',
                        color: STRUCTURE_COLORS.polymerase,
                        fontSize: '11px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap'
                    }}>
                        ✏️ DNA Pol III
                    </div>
                </Html>
            </group>

            {/* Labels das fitas */}
            <Html position={[-2.5, 2, 0]} style={{ pointerEvents: 'none' }}>
                <div style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.1))',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    color: '#22c55e',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    border: '2px solid #22c55e',
                    textAlign: 'center',
                    boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)'
                }}>
                    <div>⬆️ Fita Líder</div>
                    <div style={{ fontSize: '10px', fontWeight: 'normal', marginTop: '4px' }}>
                        5' → 3' (síntese contínua)
                    </div>
                </div>
            </Html>

            <Html position={[2.5, 2, 0]} style={{ pointerEvents: 'none' }}>
                <div style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.1))',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    color: '#3b82f6',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    border: '2px solid #3b82f6',
                    textAlign: 'center',
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
                }}>
                    <div>⬇️ Fita Retardada</div>
                    <div style={{ fontSize: '10px', fontWeight: 'normal', marginTop: '4px' }}>
                        Fragmentos de Okazaki
                    </div>
                </div>
            </Html>

            {/* Legenda de enzimas */}
            <Html position={[-4, -1, 0]} style={{ pointerEvents: 'none' }}>
                <div style={{
                    background: 'rgba(0,0,0,0.95)',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '11px',
                    width: '170px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '13px', color: '#f0abfc' }}>
                        🔬 Enzimas da Replicação
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <div style={{ 
                            width: '16px', 
                            height: '16px', 
                            borderRadius: '50%', 
                            background: STRUCTURE_COLORS.helicase,
                            boxShadow: `0 0 8px ${STRUCTURE_COLORS.helicase}`
                        }} />
                        <span>Helicase</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <div style={{ 
                            width: '16px', 
                            height: '16px', 
                            borderRadius: '4px', 
                            background: STRUCTURE_COLORS.polymerase,
                            boxShadow: `0 0 8px ${STRUCTURE_COLORS.polymerase}`
                        }} />
                        <span>DNA Polimerase III</span>
                    </div>
                    <div style={{ 
                        marginTop: '12px', 
                        paddingTop: '12px', 
                        borderTop: '1px solid rgba(255,255,255,0.2)',
                        fontSize: '10px',
                        color: '#94a3b8'
                    }}>
                        <div style={{ marginBottom: '4px' }}>
                            <span style={{ color: '#22c55e' }}>●</span> Nova fita (líder)
                        </div>
                        <div>
                            <span style={{ color: '#3b82f6' }}>●</span> Nova fita (retardada)
                        </div>
                    </div>
                </div>
            </Html>

            {/* Info sobre replicação semiconservativa */}
            <Html position={[4, -1, 0]} style={{ pointerEvents: 'none' }}>
                <div style={{
                    background: 'rgba(0,0,0,0.95)',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '11px',
                    width: '180px',
                    border: '1px solid rgba(251, 191, 36, 0.4)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#fbbf24', fontSize: '13px' }}>
                        📚 Replicação Semiconservativa
                    </div>
                    <div style={{ lineHeight: '1.6', color: '#e2e8f0', marginBottom: '8px' }}>
                        Cada nova molécula de DNA contém:
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                        • <span style={{ color: '#a78bfa' }}>1 fita original</span> (parental)
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                        • <span style={{ color: '#4ade80' }}>1 fita nova</span> (sintetizada)
                    </div>
                    <div style={{ 
                        marginTop: '10px', 
                        padding: '8px',
                        background: 'rgba(251, 191, 36, 0.1)',
                        borderRadius: '6px',
                        fontSize: '9px',
                        color: '#fbbf24'
                    }}>
                        💡 Demonstrado por Meselson & Stahl (1958)
                    </div>
                </div>
            </Html>

            {/* Partículas de ambiente */}
            {Array.from({ length: 60 }).map((_, i) => {
                const angle = (i / 60) * Math.PI * 2
                const radius = 6 + Math.random() * 2
                const y = (Math.random() - 0.5) * 14
                return (
                    <mesh
                        key={`particle-${i}`}
                        position={[
                            Math.cos(angle) * radius,
                            y,
                            Math.sin(angle) * radius,
                        ]}
                    >
                        <sphereGeometry args={[0.04, 8, 8]} />
                        <meshBasicMaterial
                            color={Object.values(BASE_COLORS)[i % 4]}
                            transparent
                            opacity={0.4}
                        />
                    </mesh>
                )
            })}
        </group>
    )
}

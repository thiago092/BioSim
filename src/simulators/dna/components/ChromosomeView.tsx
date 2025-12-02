import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Vector3, CatmullRomCurve3 } from 'three'
import { Text, Html } from '@react-three/drei'

// Gera pontos para uma curva de cromátide
function generateChromatidPoints(side: 'left' | 'right', arm: 'upper' | 'lower'): Vector3[] {
    const points: Vector3[] = []
    const xOffset = side === 'left' ? -0.4 : 0.4
    const yDirection = arm === 'upper' ? 1 : -1
    
    for (let i = 0; i <= 20; i++) {
        const t = i / 20
        const y = t * 2 * yDirection
        const x = xOffset + Math.sin(t * Math.PI * 3) * 0.15 * (side === 'left' ? 1 : -1)
        const z = Math.cos(t * Math.PI * 2) * 0.1
        points.push(new Vector3(x, y + (arm === 'upper' ? 0.3 : -0.3), z))
    }
    return points
}

// Componente para desenhar uma cromátide com curvas suaves
function Chromatid({ points, color, glowColor }: { points: Vector3[], color: string, glowColor: string }) {
    const curve = useMemo(() => new CatmullRomCurve3(points), [points])
    const tubePoints = useMemo(() => curve.getPoints(50), [curve])
    
    return (
        <group>
            {tubePoints.map((point, i) => {
                if (i % 2 !== 0) return null
                const scale = 0.12 + Math.sin(i * 0.2) * 0.02
                return (
                    <mesh key={i} position={point}>
                        <sphereGeometry args={[scale, 12, 12]} />
                        <meshStandardMaterial
                            color={color}
                            emissive={glowColor}
                            emissiveIntensity={0.4 + Math.sin(i * 0.3) * 0.2}
                            metalness={0.2}
                            roughness={0.6}
                        />
                    </mesh>
                )
            })}
        </group>
    )
}

// Componente para bandas do cromossomo (padrão de bandas G)
function ChromosomeBands({ y, width }: { y: number, width: number }) {
    return (
        <mesh position={[0, y, 0.15]} rotation={[0, 0, 0]}>
            <boxGeometry args={[width, 0.08, 0.02]} />
            <meshBasicMaterial color="#1a1a2e" transparent opacity={0.6} />
        </mesh>
    )
}

export function ChromosomeView() {
    const groupRef = useRef<Group>(null)
    const [hoveredPart, setHoveredPart] = useState<string | null>(null)

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
        }
    })

    const chromatidPoints = useMemo(() => ({
        leftUpper: generateChromatidPoints('left', 'upper'),
        leftLower: generateChromatidPoints('left', 'lower'),
        rightUpper: generateChromatidPoints('right', 'upper'),
        rightLower: generateChromatidPoints('right', 'lower'),
    }), [])

    return (
        <group ref={groupRef}>
            {/* Título */}
            <Text
                position={[0, 3.5, 0]}
                fontSize={0.35}
                color="#ffffff"
                anchorX="center"
            >
                🧬 CROMOSSOMO
            </Text>
            <Text
                position={[0, 3.1, 0]}
                fontSize={0.18}
                color="#94a3b8"
                anchorX="center"
            >
                Estrutura condensada do DNA
            </Text>

            {/* Cromátides Irmãs */}
            <group>
                {/* Cromátide Esquerda */}
                <Chromatid points={chromatidPoints.leftUpper} color="#a855f7" glowColor="#c084fc" />
                <Chromatid points={chromatidPoints.leftLower} color="#a855f7" glowColor="#c084fc" />
                
                {/* Cromátide Direita */}
                <Chromatid points={chromatidPoints.rightUpper} color="#8b5cf6" glowColor="#a78bfa" />
                <Chromatid points={chromatidPoints.rightLower} color="#8b5cf6" glowColor="#a78bfa" />
            </group>

            {/* Centrômero (ponto de união) */}
            <mesh
                position={[0, 0, 0]}
                onPointerEnter={() => setHoveredPart('centromero')}
                onPointerLeave={() => setHoveredPart(null)}
            >
                <torusGeometry args={[0.35, 0.12, 16, 32]} />
                <meshStandardMaterial
                    color="#ec4899"
                    emissive="#f472b6"
                    emissiveIntensity={hoveredPart === 'centromero' ? 0.8 : 0.5}
                    metalness={0.4}
                    roughness={0.3}
                />
            </mesh>

            {/* Cinetocoro */}
            <mesh position={[0, 0, 0.2]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial
                    color="#22c55e"
                    emissive="#4ade80"
                    emissiveIntensity={0.6}
                />
            </mesh>
            <mesh position={[0, 0, -0.2]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial
                    color="#22c55e"
                    emissive="#4ade80"
                    emissiveIntensity={0.6}
                />
            </mesh>

            {/* Bandas G (padrão de bandas) */}
            {[-1.8, -1.4, -1.0, -0.6, 0.6, 1.0, 1.4, 1.8].map((y, i) => (
                <ChromosomeBands key={i} y={y} width={0.6 + Math.abs(y) * 0.1} />
            ))}

            {/* Telômeros (extremidades) */}
            {[2.3, -2.3].map((y, i) => (
                <group key={`telomere-${i}`} position={[0, y, 0]}>
                    <mesh position={[-0.3, 0, 0]}>
                        <sphereGeometry args={[0.1, 16, 16]} />
                        <meshStandardMaterial
                            color="#f59e0b"
                            emissive="#fbbf24"
                            emissiveIntensity={0.6}
                        />
                    </mesh>
                    <mesh position={[0.3, 0, 0]}>
                        <sphereGeometry args={[0.1, 16, 16]} />
                        <meshStandardMaterial
                            color="#f59e0b"
                            emissive="#fbbf24"
                            emissiveIntensity={0.6}
                        />
                    </mesh>
                </group>
            ))}

            {/* Labels interativos */}
            <Html position={[1.2, 0, 0]} style={{ pointerEvents: 'none' }}>
                <div style={{
                    background: 'rgba(0,0,0,0.85)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    color: '#ec4899',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    border: '1px solid #ec4899'
                }}>
                    🎯 Centrômero
                </div>
            </Html>

            <Html position={[0.8, 2.3, 0]} style={{ pointerEvents: 'none' }}>
                <div style={{
                    background: 'rgba(0,0,0,0.85)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    color: '#fbbf24',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                }}>
                    🔚 Telômero
                </div>
            </Html>

            <Html position={[-1.5, 1.2, 0]} style={{ pointerEvents: 'none' }}>
                <div style={{
                    background: 'rgba(0,0,0,0.85)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    color: '#c084fc',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                }}>
                    Cromátide Irmã
                </div>
            </Html>

            <Html position={[0.5, -1.5, 0]} style={{ pointerEvents: 'none' }}>
                <div style={{
                    background: 'rgba(0,0,0,0.85)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    color: '#22c55e',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                }}>
                    🧲 Cinetocoro
                </div>
            </Html>

            {/* Histonas representadas como pequenas esferas */}
            {Array.from({ length: 60 }).map((_, i) => {
                const arm = i < 30 ? 1 : -1
                const side = (i % 2) === 0 ? 1 : -1
                const t = (i % 30) / 30
                const y = t * 2 * arm + arm * 0.3
                const x = side * (0.3 + Math.sin(t * Math.PI * 3) * 0.1)
                const z = Math.cos(i * 0.5) * 0.15

                return (
                    <mesh key={`histone-${i}`} position={[x, y, z]}>
                        <sphereGeometry args={[0.04, 8, 8]} />
                        <meshStandardMaterial
                            color="#60a5fa"
                            emissive="#3b82f6"
                            emissiveIntensity={0.3}
                            transparent
                            opacity={0.6}
                        />
                    </mesh>
                )
            })}

            {/* Partículas de ambiente */}
            {Array.from({ length: 40 }).map((_, i) => {
                const angle = (i / 40) * Math.PI * 2
                const radius = 4 + Math.random() * 1.5
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
                            color={['#c084fc', '#a855f7', '#8b5cf6', '#7c3aed'][i % 4]}
                            transparent
                            opacity={0.4}
                        />
                    </mesh>
                )
            })}
        </group>
    )
}

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CentrioleProps {
    position: [number, number, number]
    rotation?: [number, number, number]
    opacity?: number
}

// Microtúbulo individual (tripleto)
function Microtubule({ angle, radius, height, color }: { angle: number; radius: number; height: number; color: string }) {
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    
    return (
        <group position={[x, 0, z]} rotation={[0, -angle, 0]}>
            {/* Tripleto de microtúbulos */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.008, 0.008, height, 6]} />
                <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
            </mesh>
            <mesh position={[0.015, 0, 0]}>
                <cylinderGeometry args={[0.006, 0.006, height * 0.9, 6]} />
                <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
            </mesh>
            <mesh position={[0.025, 0, 0]}>
                <cylinderGeometry args={[0.005, 0.005, height * 0.8, 6]} />
                <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
            </mesh>
        </group>
    )
}

// Um centríolo individual
function SingleCentriole({ rotation = [0, 0, 0] as [number, number, number] }) {
    const groupRef = useRef<THREE.Group>(null)
    
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.5
        }
    })

    const radius = 0.04
    const height = 0.15
    
    return (
        <group ref={groupRef} rotation={rotation}>
            {/* 9 tripletos de microtúbulos dispostos em círculo */}
            {[...Array(9)].map((_, i) => (
                <Microtubule 
                    key={i}
                    angle={(i / 9) * Math.PI * 2}
                    radius={radius}
                    height={height}
                    color="#ffd700"
                />
            ))}
            
            {/* Estrutura central (hub) */}
            <mesh>
                <cylinderGeometry args={[0.015, 0.015, height * 0.6, 8]} />
                <meshStandardMaterial 
                    color="#ffaa00" 
                    emissive="#ff8800"
                    emissiveIntensity={0.3}
                    metalness={0.5}
                    roughness={0.3}
                />
            </mesh>

            {/* Raios conectando hub aos microtúbulos */}
            {[...Array(9)].map((_, i) => {
                const angle = (i / 9) * Math.PI * 2
                return (
                    <mesh 
                        key={`spoke-${i}`} 
                        position={[Math.cos(angle) * radius / 2, 0, Math.sin(angle) * radius / 2]}
                        rotation={[0, -angle + Math.PI / 2, 0]}
                    >
                        <boxGeometry args={[radius, 0.003, 0.003]} />
                        <meshBasicMaterial color="#ffcc00" transparent opacity={0.6} />
                    </mesh>
                )
            })}

            {/* Glow */}
            <mesh>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="#ffd700" transparent opacity={0.1} />
            </mesh>
        </group>
    )
}

export function Centriole({ position, rotation = [0, 0, 0], opacity = 1 }: CentrioleProps) {
    return (
        <group position={position} rotation={rotation}>
            {/* Centríolo 1 (vertical) */}
            <group position={[0, 0, 0]}>
                <SingleCentriole rotation={[Math.PI / 2, 0, 0]} />
            </group>
            
            {/* Centríolo 2 (perpendicular, formando o centrossomo) */}
            <group position={[0.08, -0.05, 0]}>
                <SingleCentriole rotation={[0, 0, Math.PI / 2]} />
            </group>

            {/* Material pericentriolar (PCM) - halo ao redor */}
            <mesh>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshBasicMaterial 
                    color="#88ff88" 
                    transparent 
                    opacity={opacity * 0.08}
                />
            </mesh>

            {/* Pontos de nucleação de microtúbulos */}
            {[...Array(6)].map((_, i) => {
                const angle = (i / 6) * Math.PI * 2
                const r = 0.1
                return (
                    <mesh 
                        key={`nucleation-${i}`}
                        position={[Math.cos(angle) * r, Math.sin(angle) * r * 0.5, 0]}
                    >
                        <sphereGeometry args={[0.012, 8, 8]} />
                        <meshStandardMaterial 
                            color="#44ff44" 
                            emissive="#44ff44"
                            emissiveIntensity={0.5}
                        />
                    </mesh>
                )
            })}
        </group>
    )
}

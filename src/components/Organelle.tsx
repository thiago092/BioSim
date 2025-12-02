import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Float } from '@react-three/drei'
import * as THREE from 'three'
import type { Phase } from '../types'

interface OrganelleProps {
    type: 'mitochondria' | 'ribosome' | 'golgi'
    position: [number, number, number]
    phase: Phase
}

// Mitocôndria com estrutura detalhada
function Mitochondria({ position }: { position: [number, number, number] }) {
    const groupRef = useRef<THREE.Group>(null)
    
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
            groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.1
        }
    })

    // Criar forma de cápsula para mitocôndria
    const cristae = useMemo(() => {
        return [...Array(5)].map((_, i) => ({
            y: (i - 2) * 0.08,
            width: 0.15 - Math.abs(i - 2) * 0.02
        }))
    }, [])

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <group ref={groupRef} position={position} rotation={[0, 0, Math.PI / 4]}>
                {/* Membrana externa */}
                <mesh>
                    <capsuleGeometry args={[0.1, 0.25, 16, 16]} />
                    <meshPhysicalMaterial
                        color="#48cae4"
                        transparent
                        opacity={0.4}
                        roughness={0.3}
                        metalness={0.1}
                        clearcoat={0.5}
                    />
                </mesh>

                {/* Membrana interna */}
                <mesh>
                    <capsuleGeometry args={[0.08, 0.22, 12, 12]} />
                    <meshPhysicalMaterial
                        color="#00b4d8"
                        transparent
                        opacity={0.5}
                        roughness={0.4}
                    />
                </mesh>

                {/* Cristas mitocondriais */}
                {cristae.map((crista, i) => (
                    <mesh key={i} position={[0, crista.y, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[crista.width, 0.015, 8, 16, Math.PI]} />
                        <meshStandardMaterial
                            color="#0096c7"
                            emissive="#0096c7"
                            emissiveIntensity={0.3}
                        />
                    </mesh>
                ))}

                {/* Matrix (interior) - glow */}
                <mesh>
                    <capsuleGeometry args={[0.05, 0.15, 8, 8]} />
                    <meshBasicMaterial
                        color="#90e0ef"
                        transparent
                        opacity={0.3}
                    />
                </mesh>

                {/* ATP sparkles */}
                {[...Array(3)].map((_, i) => (
                    <mesh key={`atp-${i}`} position={[
                        (Math.random() - 0.5) * 0.1,
                        (Math.random() - 0.5) * 0.2,
                        0.05
                    ]}>
                        <sphereGeometry args={[0.015, 8, 8]} />
                        <meshStandardMaterial
                            color="#ffd700"
                            emissive="#ffd700"
                            emissiveIntensity={0.8}
                        />
                    </mesh>
                ))}
            </group>
        </Float>
    )
}

// Complexo de Golgi com cisternas
function GolgiApparatus({ position }: { position: [number, number, number] }) {
    const groupRef = useRef<THREE.Group>(null)
    
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
        }
    })

    return (
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
            <group ref={groupRef} position={position}>
                {/* Cisternas empilhadas */}
                {[...Array(5)].map((_, i) => (
                    <mesh key={i} position={[0, (i - 2) * 0.06, 0]} rotation={[0, 0, (i - 2) * 0.1]}>
                        <torusGeometry args={[0.12 - i * 0.01, 0.025, 8, 24, Math.PI * 1.5]} />
                        <meshPhysicalMaterial
                            color={`hsl(${45 + i * 5}, 90%, ${60 - i * 5}%)`}
                            transparent
                            opacity={0.7}
                            roughness={0.3}
                            metalness={0.1}
                        />
                    </mesh>
                ))}

                {/* Vesículas sendo liberadas */}
                {[...Array(4)].map((_, i) => (
                    <mesh 
                        key={`vesicle-${i}`} 
                        position={[
                            0.18 + i * 0.05,
                            (Math.random() - 0.5) * 0.15,
                            (Math.random() - 0.5) * 0.1
                        ]}
                    >
                        <sphereGeometry args={[0.025, 12, 12]} />
                        <meshStandardMaterial
                            color="#ffc300"
                            emissive="#ffc300"
                            emissiveIntensity={0.4}
                            transparent
                            opacity={0.8}
                        />
                    </mesh>
                ))}

                {/* Face cis (entrada) */}
                <mesh position={[-0.15, 0, 0]}>
                    <sphereGeometry args={[0.03, 8, 8]} />
                    <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
                </mesh>

                {/* Face trans (saída) */}
                <mesh position={[0.2, 0, 0]}>
                    <sphereGeometry args={[0.03, 8, 8]} />
                    <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
                </mesh>
            </group>
        </Float>
    )
}

export function Organelle({ type, position, phase }: OrganelleProps) {
    // Organelas visíveis em todas as fases, mas com opacidade reduzida durante divisão
    const isDividing = phase.includes('Prófase') || phase.includes('Metáfase') || 
                       phase.includes('Anáfase') || phase.includes('Telófase')
    
    const opacity = isDividing ? 0.3 : 1

    if (type === 'mitochondria') {
        return (
            <group scale={opacity}>
                <Mitochondria position={position} />
            </group>
        )
    }

    if (type === 'golgi') {
        return (
            <group scale={opacity}>
                <GolgiApparatus position={position} />
            </group>
        )
    }

    // Ribossomo simples
    return (
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
            <Sphere args={[0.03, 12, 12]} position={position}>
                <meshStandardMaterial
                    color="#4ecdc4"
                    emissive="#2daa9f"
                    emissiveIntensity={0.3}
                    transparent
                    opacity={0.8 * opacity}
                />
            </Sphere>
        </Float>
    )
}

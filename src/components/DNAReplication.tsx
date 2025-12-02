import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Torus } from '@react-three/drei'
import * as THREE from 'three'
import { easing } from 'maath'
import type { Phase } from '../types'

interface DNAReplicationProps {
    phase: Phase
}

export function DNAReplication({ phase }: DNAReplicationProps) {
    const groupRef = useRef<THREE.Group>(null)
    const glowRef = useRef<THREE.Mesh>(null)

    useFrame((state, delta) => {
        if (!groupRef.current) return

        // Mostrar apenas na Fase S
        const isPhaseS = phase === 'Intérfase-S'
        const targetScale = isPhaseS ? 1 : 0

        easing.damp3(groupRef.current.scale, [targetScale, targetScale, targetScale], 0.5, delta)

        // Efeito de brilho pulsante
        if (glowRef.current && isPhaseS) {
            const pulseIntensity = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5
            glowRef.current.scale.setScalar(1 + pulseIntensity * 0.3)

            if (glowRef.current.material instanceof THREE.MeshBasicMaterial) {
                glowRef.current.material.opacity = 0.3 + pulseIntensity * 0.2
            }
        }

        // Rotação suave
        if (groupRef.current && isPhaseS) {
            groupRef.current.rotation.z += delta * 0.5
        }
    })

    return (
        <group ref={groupRef} scale={0}>
            {/* Efeito de brilho central */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[2, 32, 32]} />
                <meshBasicMaterial
                    color="#00ffff"
                    transparent
                    opacity={0.3}
                />
            </mesh>

            {/* Núcleo brilhante durante replicação */}
            <Sphere args={[1.5, 32, 32]}>
                <meshStandardMaterial
                    color="#ff4444"
                    emissive="#00ffff"
                    emissiveIntensity={0.8}
                    transparent
                    opacity={0.7}
                />
            </Sphere>

            {/* Anéis de energia representando replicação */}
            {[0, 1, 2].map((i) => (
                <group key={i} rotation={[Math.PI / 2, 0, i * Math.PI / 3]}>
                    <Torus args={[1.2 + i * 0.3, 0.05, 16, 32]}>
                        <meshBasicMaterial
                            color="#00ffff"
                            transparent
                            opacity={0.6 - i * 0.15}
                        />
                    </Torus>
                </group>
            ))}

            {/* Partículas de DNA sendo sintetizado */}
            {[...Array(8)].map((_, i) => {
                const angle = (i / 8) * Math.PI * 2
                const radius = 1.8
                return (
                    <mesh
                        key={i}
                        position={[
                            Math.cos(angle) * radius,
                            Math.sin(angle) * radius,
                            0
                        ]}
                    >
                        <sphereGeometry args={[0.08, 8, 8]} />
                        <meshBasicMaterial
                            color="#ffff00"
                            transparent
                            opacity={0.8}
                        />
                    </mesh>
                )
            })}

            {/* Texto indicativo (opcional) */}
            <group position={[0, -2.5, 0]}>
                <mesh>
                    <planeGeometry args={[3, 0.5]} />
                    <meshBasicMaterial
                        color="#00ffff"
                        transparent
                        opacity={0.8}
                    />
                </mesh>
            </group>
        </group>
    )
}

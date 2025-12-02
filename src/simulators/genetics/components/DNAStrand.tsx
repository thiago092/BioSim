import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Cylinder, Sphere } from '@react-three/drei'
import * as THREE from 'three'

export function DNAStrand() {
    const groupRef = useRef<THREE.Group>(null)

    // Rotação suave
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
        }
    })

    const helixRadius = 0.5
    const helixHeight = 6
    const turns = 3
    const baseCount = 30

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            {/* Duas hélices */}
            {[0, Math.PI].map((offset, helixIndex) => (
                <group key={helixIndex}>
                    {Array.from({ length: baseCount }).map((_, i) => {
                        const t = i / baseCount
                        const angle = t * Math.PI * 2 * turns + offset
                        const x = Math.cos(angle) * helixRadius
                        const z = Math.sin(angle) * helixRadius
                        const y = (t - 0.5) * helixHeight

                        return (
                            <Sphere key={i} args={[0.08, 8, 8]} position={[x, y, z]}>
                                <meshStandardMaterial
                                    color={helixIndex === 0 ? '#60a5fa' : '#f472b6'}
                                    emissive={helixIndex === 0 ? '#60a5fa' : '#f472b6'}
                                    emissiveIntensity={0.3}
                                    transparent
                                    opacity={0.8}
                                />
                            </Sphere>
                        )
                    })}
                </group>
            ))}

            {/* Barras conectoras (pares de bases) */}
            {Array.from({ length: Math.floor(baseCount / 2) }).map((_, i) => {
                const t = (i * 2) / baseCount
                const angle = t * Math.PI * 2 * turns
                const y = (t - 0.5) * helixHeight

                const x1 = Math.cos(angle) * helixRadius
                const z1 = Math.sin(angle) * helixRadius
                const x2 = Math.cos(angle + Math.PI) * helixRadius
                const z2 = Math.sin(angle + Math.PI) * helixRadius

                const midX = (x1 + x2) / 2
                const midZ = (z1 + z2) / 2
                const length = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2)
                const rotY = Math.atan2(z2 - z1, x2 - x1)

                return (
                    <Cylinder
                        key={i}
                        args={[0.03, 0.03, length, 6]}
                        position={[midX, y, midZ]}
                        rotation={[0, rotY, Math.PI / 2]}
                    >
                        <meshStandardMaterial
                            color="#a78bfa"
                            transparent
                            opacity={0.4}
                        />
                    </Cylinder>
                )
            })}
        </group>
    )
}

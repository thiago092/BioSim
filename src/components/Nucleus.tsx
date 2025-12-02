import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface NucleusProps {
    visible: boolean
    opacity?: number
}

export function Nucleus({ visible, opacity = 1 }: NucleusProps) {
    const nucleusRef = useRef<THREE.Mesh>(null)
    const nucleolusRef = useRef<THREE.Mesh>(null)
    
    useFrame((state) => {
        if (nucleusRef.current) {
            nucleusRef.current.rotation.y = state.clock.elapsedTime * 0.1
        }
        if (nucleolusRef.current) {
            nucleolusRef.current.rotation.x = state.clock.elapsedTime * 0.15
            nucleolusRef.current.rotation.z = state.clock.elapsedTime * 0.1
        }
    })

    if (!visible) return null

    return (
        <group>
            {/* Membrana nuclear externa */}
            <Sphere ref={nucleusRef} args={[0.72, 64, 64]}>
                <meshPhysicalMaterial
                    color="#9d4edd"
                    roughness={0.2}
                    metalness={0.1}
                    transmission={0.3}
                    thickness={0.8}
                    transparent
                    opacity={opacity * 0.4}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                />
            </Sphere>
            
            {/* Núcleo interno (nucleoplasma) */}
            <Sphere args={[0.68, 48, 48]}>
                <MeshDistortMaterial
                    color="#c77dff"
                    distort={0.15}
                    speed={1.5}
                    roughness={0.4}
                    metalness={0}
                    transparent
                    opacity={opacity * 0.6}
                />
            </Sphere>

            {/* Nucléolo (região mais densa) */}
            <Sphere ref={nucleolusRef} args={[0.25, 32, 32]} position={[0.15, 0.1, 0]}>
                <meshStandardMaterial
                    color="#7b2cbf"
                    roughness={0.3}
                    metalness={0.2}
                    transparent
                    opacity={opacity * 0.9}
                    emissive="#7b2cbf"
                    emissiveIntensity={0.3}
                />
            </Sphere>

            {/* Poros nucleares (pequenas esferas na superfície) */}
            {[...Array(12)].map((_, i) => {
                const phi = Math.acos(-1 + (2 * i) / 12)
                const theta = Math.sqrt(12 * Math.PI) * phi
                const x = 0.72 * Math.cos(theta) * Math.sin(phi)
                const y = 0.72 * Math.sin(theta) * Math.sin(phi)
                const z = 0.72 * Math.cos(phi)
                
                return (
                    <mesh key={i} position={[x, y, z]}>
                        <torusGeometry args={[0.04, 0.015, 8, 16]} />
                        <meshStandardMaterial
                            color="#e0aaff"
                            transparent
                            opacity={opacity * 0.7}
                            emissive="#e0aaff"
                            emissiveIntensity={0.2}
                        />
                    </mesh>
                )
            })}

            {/* Glow interno */}
            <Sphere args={[0.5, 16, 16]}>
                <meshBasicMaterial
                    color="#c77dff"
                    transparent
                    opacity={opacity * 0.15}
                />
            </Sphere>
        </group>
    )
}

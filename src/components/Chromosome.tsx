import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Float } from '@react-three/drei'
import type { Phase } from '../types'

interface ChromosomeProps {
    position: [number, number, number]
    rotation: [number, number, number]
    phase: Phase
    opacity?: number
    color?: string
}

// Cromátide individual com forma orgânica
function Chromatid({ 
    position, 
    rotation, 
    color, 
    opacity,
    isLeft 
}: { 
    position: [number, number, number]
    rotation: [number, number, number]
    color: string
    opacity: number
    isLeft: boolean
}) {
    const meshRef = useRef<THREE.Mesh>(null)
    
    // Criar forma de X com curvas
    const curve = useMemo(() => {
        const points = [
            new THREE.Vector3(0, 0.5, 0),
            new THREE.Vector3(isLeft ? -0.05 : 0.05, 0.25, 0),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(isLeft ? 0.05 : -0.05, -0.25, 0),
            new THREE.Vector3(0, -0.5, 0),
        ]
        return new THREE.CatmullRomCurve3(points)
    }, [isLeft])

    return (
        <group position={position} rotation={rotation}>
            <mesh ref={meshRef}>
                <tubeGeometry args={[curve, 32, 0.08, 12, false]} />
                <meshPhysicalMaterial
                    color={color}
                    roughness={0.3}
                    metalness={0.2}
                    transparent
                    opacity={opacity}
                    clearcoat={0.5}
                    clearcoatRoughness={0.2}
                    emissive={color}
                    emissiveIntensity={0.1}
                />
            </mesh>
            
            {/* Bandas G (padrão característico) */}
            {[0.3, 0.1, -0.1, -0.3].map((y, i) => (
                <mesh key={i} position={[0, y, 0.05]}>
                    <boxGeometry args={[0.12, 0.06, 0.04]} />
                    <meshStandardMaterial
                        color={i % 2 === 0 ? '#1a1a2e' : color}
                        transparent
                        opacity={opacity * 0.8}
                    />
                </mesh>
            ))}
        </group>
    )
}

export function Chromosome({ position, rotation, phase, opacity = 1, color = "#9d4edd" }: ChromosomeProps) {
    const group = useRef<THREE.Group>(null)
    const leftChromatid = useRef<THREE.Group>(null)
    const rightChromatid = useRef<THREE.Group>(null)
    const separation = useRef(0)
    const pulseRef = useRef(0)

    useFrame((state, delta) => {
        if (!group.current) return

        // Pulsação sutil
        pulseRef.current = Math.sin(state.clock.elapsedTime * 2) * 0.02

        // Animação de separação na Anáfase
        if (phase === 'Anáfase') {
            separation.current = THREE.MathUtils.lerp(separation.current, 2.0, delta * 1.5)
        } else if (phase === 'Telófase') {
            separation.current = 2.0
        } else {
            separation.current = THREE.MathUtils.lerp(separation.current, 0, delta * 2)
        }

        if (leftChromatid.current && rightChromatid.current) {
            leftChromatid.current.position.x = -separation.current * 0.5
            rightChromatid.current.position.x = separation.current * 0.5

            // Efeito de "puxão" (V-shape) durante anáfase
            if (phase === 'Anáfase') {
                leftChromatid.current.rotation.z = 0.3 + pulseRef.current
                rightChromatid.current.rotation.z = -0.3 - pulseRef.current
                leftChromatid.current.position.y = -separation.current * 0.1
                rightChromatid.current.position.y = -separation.current * 0.1
            } else {
                leftChromatid.current.rotation.z = 0
                rightChromatid.current.rotation.z = 0
                leftChromatid.current.position.y = 0
                rightChromatid.current.position.y = 0
            }
        }

        // Rotação suave
        group.current.rotation.z += delta * 0.1
    })

    return (
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.1}>
            <group ref={group} position={position} rotation={rotation} scale={1 + pulseRef.current}>
                {/* Cromátide Esquerda */}
                <group ref={leftChromatid}>
                    <Chromatid 
                        position={[0, 0, 0]} 
                        rotation={[0, 0, 0]} 
                        color={color}
                        opacity={opacity}
                        isLeft={true}
                    />
                </group>

                {/* Centrômero (ponto de união) */}
                <mesh position={[0, 0, 0]}>
                    <sphereGeometry args={[0.12, 24, 24]} />
                    <meshStandardMaterial 
                        color="#ffd700" 
                        transparent 
                        opacity={opacity}
                        emissive="#ffd700"
                        emissiveIntensity={0.5}
                        metalness={0.4}
                        roughness={0.2}
                    />
                </mesh>

                {/* Cinetócoro (estrutura no centrômero) */}
                <mesh position={[0.15, 0, 0]}>
                    <dodecahedronGeometry args={[0.05, 0]} />
                    <meshStandardMaterial 
                        color="#ff6b35" 
                        transparent 
                        opacity={opacity}
                        emissive="#ff6b35"
                        emissiveIntensity={0.4}
                    />
                </mesh>
                <mesh position={[-0.15, 0, 0]}>
                    <dodecahedronGeometry args={[0.05, 0]} />
                    <meshStandardMaterial 
                        color="#ff6b35" 
                        transparent 
                        opacity={opacity}
                        emissive="#ff6b35"
                        emissiveIntensity={0.4}
                    />
                </mesh>

                {/* Cromátide Direita */}
                <group ref={rightChromatid}>
                    <Chromatid 
                        position={[0, 0, 0]} 
                        rotation={[0, 0, 0]} 
                        color={color}
                        opacity={opacity}
                        isLeft={false}
                    />
                </group>

                {/* Glow ao redor */}
                <mesh>
                    <sphereGeometry args={[0.6, 16, 16]} />
                    <meshBasicMaterial 
                        color={color} 
                        transparent 
                        opacity={opacity * 0.05}
                    />
                </mesh>
            </group>
        </Float>
    )
}

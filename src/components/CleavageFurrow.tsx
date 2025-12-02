import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { easing } from 'maath'
import type { Phase } from '../types'

interface CleavageFurrowProps {
    phase: Phase
}

export function CleavageFurrow({ phase }: CleavageFurrowProps) {
    const furrowRef = useRef<THREE.Group>(null)
    const leftHalfRef = useRef<THREE.Mesh>(null)
    const rightHalfRef = useRef<THREE.Mesh>(null)

    useFrame((_, delta) => {
        if (!furrowRef.current || !leftHalfRef.current || !rightHalfRef.current) return

        // Citocinese: sulco de clivagem se aprofunda gradualmente
        let furrowDepth = 0
        let cellSeparation = 0
        let targetOpacity = 0

        if (phase === 'Citocinese') {
            furrowDepth = 0.8
            cellSeparation = 0
            targetOpacity = 1
        } else if (phase === 'Células-Filhas' || phase.includes('Células-Filhas')) {
            furrowDepth = 1.5
            cellSeparation = 1.5
            targetOpacity = 1
        }

        // Anima profundidade do sulco
        easing.damp(furrowRef.current.scale, 'y', furrowDepth, 0.5, delta)
        easing.damp3(furrowRef.current.scale, [1, furrowDepth, 1], 0.5, delta)

        // Anima separação das células
        const targetLeftX = -cellSeparation
        const targetRightX = cellSeparation

        easing.damp(leftHalfRef.current.position, 'x', targetLeftX, 0.5, delta)
        easing.damp(rightHalfRef.current.position, 'x', targetRightX, 0.5, delta)

        // Opacidade
        if (leftHalfRef.current.material instanceof THREE.MeshStandardMaterial) {
            easing.damp(leftHalfRef.current.material, 'opacity', targetOpacity, 0.3, delta)
        }
        if (rightHalfRef.current.material instanceof THREE.MeshStandardMaterial) {
            easing.damp(rightHalfRef.current.material, 'opacity', targetOpacity, 0.3, delta)
        }
    })

    return (
        <group ref={furrowRef}>
            {/* Sulco de clivagem - anel constritivo */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2.5, 0.15, 16, 32]} />
                <meshStandardMaterial
                    color="#ffc8dd"
                    emissive="#ff99bb"
                    emissiveIntensity={0.3}
                    transparent
                    opacity={0.6}
                />
            </mesh>

            {/* Metade esquerda da célula se dividindo */}
            <mesh ref={leftHalfRef} position={[0, 0, 0]}>
                <sphereGeometry args={[2.5, 32, 32, 0, Math.PI]} />
                <meshStandardMaterial
                    color="#4488ff"
                    transparent
                    opacity={0}
                    side={THREE.DoubleSide}
                    roughness={0.4}
                />
            </mesh>

            {/* Metade direita da célula se dividindo */}
            <mesh ref={rightHalfRef} position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
                <sphereGeometry args={[2.5, 32, 32, 0, Math.PI]} />
                <meshStandardMaterial
                    color="#4488ff"
                    transparent
                    opacity={0}
                    side={THREE.DoubleSide}
                    roughness={0.4}
                />
            </mesh>
        </group>
    )
}

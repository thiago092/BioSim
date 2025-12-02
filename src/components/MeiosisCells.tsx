import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import * as THREE from 'three'
import { Nucleus } from './Nucleus'
import type { Phase } from '../types'

interface MeiosisCellsProps {
    phase: Phase
}

export function MeiosisCells({ phase }: MeiosisCellsProps) {
    // Referências para 4 gametas
    const gamete1 = useRef<THREE.Group>(null)
    const gamete2 = useRef<THREE.Group>(null)
    const gamete3 = useRef<THREE.Group>(null)
    const gamete4 = useRef<THREE.Group>(null)

    const shouldShow = phase === 'Gametas'

    useFrame((_, delta) => {
        const targetScale = shouldShow ? 0.5 : 0
        const positions = [
            [-3, 2, 0],
            [3, 2, 0],
            [-3, -2, 0],
            [3, -2, 0]
        ]

        const refs = [gamete1, gamete2, gamete3, gamete4]

        refs.forEach((ref, i) => {
            if (ref.current) {
                easing.damp3(ref.current.scale, [targetScale, targetScale, targetScale], 0.5, delta)
                easing.damp3(ref.current.position, positions[i] as [number, number, number], 0.5, delta)
            }
        })
    })

    const colors = ['#ff0055', '#0055ff', '#00ff55', '#ffff00']

    return (
        <group>
            {[gamete1, gamete2, gamete3, gamete4].map((ref, i) => (
                <group key={i} ref={ref} scale={0}>
                    <mesh>
                        <sphereGeometry args={[2, 32, 32]} />
                        <meshStandardMaterial
                            color={colors[i]}
                            transparent
                            opacity={0.15}
                            roughness={0.2}
                        />
                    </mesh>
                    <Nucleus visible={true} />
                    {/* Indicador haploide */}
                    <mesh position={[0, 1.5, 0]}>
                        <torusGeometry args={[0.3, 0.08, 8, 16]} />
                        <meshStandardMaterial
                            color={colors[i]}
                            emissive={colors[i]}
                            emissiveIntensity={0.5}
                        />
                    </mesh>
                </group>
            ))}
        </group>
    )
}

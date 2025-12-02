import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { easing } from 'maath'
import type { Phase } from '../types'

interface CellProps {
    phase: Phase
    scale?: number
}

export function Cell({ phase, scale = 1 }: CellProps) {
    const leftCell = useRef<THREE.Group>(null)
    const rightCell = useRef<THREE.Group>(null)
    const mainCell = useRef<THREE.Group>(null)

    useFrame((_, delta) => {
        // During Telophase, split into two cells
        const isTelophase = phase === 'Telófase'

        if (mainCell.current) {
            const targetScale = isTelophase ? 0 : 1
            easing.damp3(mainCell.current.scale, [targetScale, targetScale, targetScale], 0.3, delta)
        }

        if (leftCell.current) {
            const targetScale = isTelophase ? 0.7 : 0
            const targetX = isTelophase ? -2.2 : 0
            easing.damp3(leftCell.current.scale, [targetScale, targetScale, targetScale], 0.3, delta)
            easing.damp(leftCell.current.position, 'x', targetX, 0.3, delta)
        }

        if (rightCell.current) {
            const targetScale = isTelophase ? 0.7 : 0
            const targetX = isTelophase ? 2.2 : 0
            easing.damp3(rightCell.current.scale, [targetScale, targetScale, targetScale], 0.3, delta)
            easing.damp(rightCell.current.position, 'x', targetX, 0.3, delta)
        }
    })

    return (
        <>
            {/* Main cell (visible in all phases except Telophase) */}
            <group ref={mainCell}>
                <Sphere args={[3, 64, 64]}>
                    <MeshDistortMaterial
                        color="#4488ff"
                        attach="material"
                        distort={0.3}
                        speed={2}
                        roughness={0.2}
                        transparent
                        opacity={0.2}
                    />
                </Sphere>
            </group>

            {/* Left daughter cell (visible only in Telophase) */}
            <group ref={leftCell} scale={0}>
                <Sphere args={[2.5, 64, 64]}>
                    <MeshDistortMaterial
                        color="#4488ff"
                        attach="material"
                        distort={0.3}
                        speed={2}
                        roughness={0.2}
                        transparent
                        opacity={0.2}
                    />
                </Sphere>
            </group>

            {/* Right daughter cell (visible only in Telophase) */}
            <group ref={rightCell} scale={0}>
                <Sphere args={[2.5, 64, 64]}>
                    <MeshDistortMaterial
                        color="#4488ff"
                        attach="material"
                        distort={0.3}
                        speed={2}
                        roughness={0.2}
                        transparent
                        opacity={0.2}
                    />
                </Sphere>
            </group>
        </>
    )
}

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import * as THREE from 'three'
import { Cell } from './Cell'
import { Nucleus } from './Nucleus'
import type { Phase } from '../types'

interface DaughterCellsProps {
    phase: Phase
}

export function DaughterCells({ phase }: DaughterCellsProps) {
    const leftCellRef = useRef<THREE.Group>(null)
    const rightCellRef = useRef<THREE.Group>(null)

    // Mostrar células-filhas nas fases finais
    const shouldShow = phase === 'Células-Filhas' ||
        phase === 'Células-Filhas-G1' ||
        phase === 'Células-Intermediárias'

    useFrame((_, delta) => {
        const targetScale = shouldShow ? 0.8 : 0
        const targetLeftX = shouldShow ? -3 : -2
        const targetRightX = shouldShow ? 3 : 2

        if (leftCellRef.current) {
            easing.damp3(leftCellRef.current.scale, [targetScale, targetScale, targetScale], 0.5, delta)
            easing.damp3(leftCellRef.current.position, [targetLeftX, 0, 0], 0.5, delta)
        }

        if (rightCellRef.current) {
            easing.damp3(rightCellRef.current.scale, [targetScale, targetScale, targetScale], 0.5, delta)
            easing.damp3(rightCellRef.current.position, [targetRightX, 0, 0], 0.5, delta)
        }
    })

    return (
        <group>
            {/* Célula-filha esquerda */}
            <group ref={leftCellRef} scale={0}>
                <Cell phase={phase} scale={1.2} />
                <Nucleus visible={true} />
            </group>

            {/* Célula-filha direita */}
            <group ref={rightCellRef} scale={0}>
                <Cell phase={phase} scale={1.2} />
                <Nucleus visible={true} />
            </group>
        </group>
    )
}

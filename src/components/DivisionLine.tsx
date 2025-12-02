import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import * as THREE from 'three'
import type { Phase } from '../types'

interface DivisionLineProps {
    phase: Phase
}

export function DivisionLine({ phase }: DivisionLineProps) {
    const lineRef = useRef<THREE.Mesh>(null)

    // Mostrar linha de divisão durante citocinese
    const shouldShow = phase === 'Citocinese' ||
        phase === 'Citocinese-I' ||
        phase === 'Citocinese-II'

    useFrame((_, delta) => {
        if (lineRef.current) {
            const targetOpacity = shouldShow ? 1 : 0
            easing.damp(lineRef.current.material as THREE.MeshStandardMaterial, 'opacity', targetOpacity, 0.5, delta)
        }
    })

    return (
        <mesh ref={lineRef} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 6, 16]} />
            <meshStandardMaterial
                color="#ffaa00"
                emissive="#ff8800"
                emissiveIntensity={0.5}
                transparent
                opacity={0}
            />
        </mesh>
    )
}

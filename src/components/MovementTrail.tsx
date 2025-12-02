import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

interface MovementTrailProps {
    startPos: THREE.Vector3
    endPos: THREE.Vector3
    color?: string
    opacity?: number
}

export function MovementTrail({ startPos, endPos, color = "#ff00ff", opacity = 0.6 }: MovementTrailProps) {
    const lineRef = useRef<any>(null)
    const dashOffset = useRef(0)

    useFrame((state, delta) => {
        // Anima o dash offset para criar efeito de "marching ants"
        dashOffset.current += delta * 2

        if (lineRef.current && lineRef.current.material) {
            lineRef.current.material.dashOffset = -dashOffset.current
        }
    })

    // Cria pontos da linha do centro até a posição final
    const points = [startPos, endPos]

    return (
        <Line
            ref={lineRef}
            points={points}
            color={color}
            lineWidth={2}
            dashed
            dashScale={10}
            dashSize={0.3}
            gapSize={0.2}
            transparent
            opacity={opacity}
        />
    )
}

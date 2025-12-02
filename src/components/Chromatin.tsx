import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CatmullRomLine } from '@react-three/drei'

interface ChromatinProps {
    opacity?: number
    color?: string
}

export function Chromatin({ opacity = 1, color = "#e0aaff" }: ChromatinProps) {
    // Gera vários "fios" emaranhados dentro de uma esfera imaginária
    const threads = useMemo(() => {
        const numThreads = 6
        const pointsPerThread = 20
        const radius = 0.6

        return new Array(numThreads).fill(0).map(() => {
            const points = []
            for (let i = 0; i < pointsPerThread; i++) {
                // Random walk esférico
                const u = Math.random()
                const v = Math.random()
                const theta = 2 * Math.PI * u
                const phi = Math.acos(2 * v - 1)
                const r = radius * Math.cbrt(Math.random()) // Distribuição uniforme na esfera

                points.push(new THREE.Vector3(
                    r * Math.sin(phi) * Math.cos(theta),
                    r * Math.sin(phi) * Math.sin(theta),
                    r * Math.cos(phi)
                ))
            }
            return points
        })
    }, [])

    const groupRef = useRef<THREE.Group>(null)

    useFrame((state) => {
        if (groupRef.current) {
            // Movimento suave de "respiração" ou flutuação
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2
        }
    })

    return (
        <group ref={groupRef}>
            {threads.map((points, i) => (
                <CatmullRomLine
                    key={i}
                    points={points}
                    color={color}
                    lineWidth={2} // Fios finos
                    transparent
                    opacity={opacity}
                    curveType="catmullrom"
                    tension={0.5}
                />
            ))}
        </group>
    )
}

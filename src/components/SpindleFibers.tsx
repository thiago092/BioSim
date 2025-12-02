import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { QuadraticBezierLine, Line } from '@react-three/drei'

interface SpindleFibersProps {
    startPos: THREE.Vector3
    endPos: THREE.Vector3
    opacity?: number
    tension?: number
    targetPositions?: THREE.Vector3[]
}

export function SpindleFibers({ startPos, endPos, opacity = 0.5, tension = 0.5, targetPositions = [] }: SpindleFibersProps) {
    const groupRef = useRef<THREE.Group>(null)
    const time = useRef(0)

    // Animação das fibras pulsando
    useFrame((state, delta) => {
        time.current += delta
    })

    // Gera fibras polares com variação
    const polarFibers = useMemo(() => {
        return new Array(12).fill(0).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2
            const radius = 0.3 + Math.random() * 0.2
            return {
                midOffset: new THREE.Vector3(
                    Math.cos(angle) * radius,
                    Math.sin(angle) * radius,
                    (Math.random() - 0.5) * 0.3
                ).multiplyScalar(1.5 * (1 - tension)),
                color: i % 3 === 0 ? '#88ffff' : i % 3 === 1 ? '#aaffff' : '#66ddff',
                width: 1 + Math.random() * 0.5
            }
        })
    }, [tension])

    // Fibras astrais (irradiam dos centríolos)
    const astralFibers = useMemo(() => {
        const fibers: { start: THREE.Vector3; end: THREE.Vector3; color: string }[] = []
        
        // Fibras do polo 1
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2
            const length = 0.8 + Math.random() * 0.4
            fibers.push({
                start: startPos.clone(),
                end: startPos.clone().add(new THREE.Vector3(
                    Math.cos(angle) * length,
                    Math.sin(angle) * length,
                    (Math.random() - 0.5) * 0.3
                )),
                color: '#44aaff'
            })
        }
        
        // Fibras do polo 2
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2
            const length = 0.8 + Math.random() * 0.4
            fibers.push({
                start: endPos.clone(),
                end: endPos.clone().add(new THREE.Vector3(
                    Math.cos(angle) * length,
                    Math.sin(angle) * length,
                    (Math.random() - 0.5) * 0.3
                )),
                color: '#44aaff'
            })
        }
        
        return fibers
    }, [startPos, endPos])

    return (
        <group ref={groupRef}>
            {/* Áster (halo ao redor dos centríolos) */}
            <mesh position={startPos.toArray()}>
                <sphereGeometry args={[0.4, 16, 16]} />
                <meshBasicMaterial color="#44aaff" transparent opacity={opacity * 0.1} />
            </mesh>
            <mesh position={endPos.toArray()}>
                <sphereGeometry args={[0.4, 16, 16]} />
                <meshBasicMaterial color="#44aaff" transparent opacity={opacity * 0.1} />
            </mesh>

            {/* Fibras Astrais */}
            {astralFibers.map((fiber, i) => (
                <Line
                    key={`astral-${i}`}
                    points={[fiber.start, fiber.end]}
                    color={fiber.color}
                    lineWidth={0.8}
                    transparent
                    opacity={opacity * 0.4}
                />
            ))}

            {/* Fibras Polares (Polo a Polo) - Microtúbulos interpolares */}
            {polarFibers.map((fiber, i) => {
                const midPoint = startPos.clone().lerp(endPos, 0.5).add(fiber.midOffset)
                return (
                    <QuadraticBezierLine
                        key={`polar-${i}`}
                        start={startPos}
                        end={endPos}
                        mid={midPoint}
                        color={fiber.color}
                        lineWidth={fiber.width}
                        transparent
                        opacity={opacity * 0.5}
                    />
                )
            })}

            {/* Fibras do Cinetocoro (Polo a Cromossomo) */}
            {targetPositions.map((target, i) => (
                <group key={`kinetochore-${i}`}>
                    {/* Feixes de fibras para cada polo */}
                    {[0, 1, 2].map((j) => {
                        const offset = new THREE.Vector3(
                            (Math.random() - 0.5) * 0.1,
                            (Math.random() - 0.5) * 0.1,
                            0
                        )
                        return (
                            <group key={`bundle-${j}`}>
                                <QuadraticBezierLine
                                    start={startPos.clone().add(offset)}
                                    end={target}
                                    mid={startPos.clone().lerp(target, 0.5).add(offset)}
                                    color="#ffffff"
                                    lineWidth={1.2}
                                    transparent
                                    opacity={opacity * 0.8}
                                />
                                <QuadraticBezierLine
                                    start={endPos.clone().add(offset)}
                                    end={target}
                                    mid={endPos.clone().lerp(target, 0.5).add(offset)}
                                    color="#ffffff"
                                    lineWidth={1.2}
                                    transparent
                                    opacity={opacity * 0.8}
                                />
                            </group>
                        )
                    })}
                </group>
            ))}

            {/* Linha central do fuso (eixo) */}
            <Line
                points={[startPos, endPos]}
                color="#ffffff"
                lineWidth={0.5}
                transparent
                opacity={opacity * 0.2}
                dashed
                dashSize={0.1}
                gapSize={0.05}
            />
        </group>
    )
}

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import * as THREE from 'three'
import type { Phase } from '../types'

interface CrossingOverProps {
    phase: Phase
}

export function CrossingOver({ phase }: CrossingOverProps) {
    const group1 = useRef<THREE.Group>(null)
    const group2 = useRef<THREE.Group>(null)
    const [exchangeProgress, setExchangeProgress] = useState(0)

    const shouldShow = phase === 'Crossing-Over' || phase === 'Prófase-I'
    const isExchanging = phase === 'Crossing-Over'

    useFrame((state, delta) => {
        const targetScale = shouldShow ? 1 : 0

        if (group1.current) {
            easing.damp3(group1.current.scale, [targetScale, targetScale, targetScale], 0.5, delta)
        }

        if (group2.current) {
            easing.damp3(group2.current.scale, [targetScale, targetScale, targetScale], 0.5, delta)
        }

        // Animação de troca genética
        if (isExchanging) {
            setExchangeProgress(prev => Math.min(prev + delta * 0.5, 1))
        } else {
            setExchangeProgress(prev => Math.max(prev - delta * 0.5, 0))
        }
    })

    // Cores que se mesclam durante crossing-over
    const color1 = new THREE.Color('#ff0055')
    const color2 = new THREE.Color('#0055ff')
    const mixedColor = new THREE.Color().lerpColors(color1, color2, exchangeProgress * 0.5)

    return (
        <group>
            {/* Cromossomo homólogo 1 */}
            <group ref={group1} position={[-1.2, 2, 0]} scale={0}>
                {/* Braço superior - parte que vai trocar */}
                <mesh position={[0, 0.4, 0]}>
                    <capsuleGeometry args={[0.08, 0.6, 8, 16]} />
                    <meshStandardMaterial
                        color={exchangeProgress > 0.5 ? mixedColor : color1}
                        emissive={exchangeProgress > 0.5 ? mixedColor : color1}
                        emissiveIntensity={0.3 + exchangeProgress * 0.3}
                    />
                </mesh>

                {/* Braço inferior */}
                <mesh position={[0, -0.4, 0]}>
                    <capsuleGeometry args={[0.08, 0.6, 8, 16]} />
                    <meshStandardMaterial
                        color={color1}
                        emissive={color1}
                        emissiveIntensity={0.3}
                    />
                </mesh>

                {/* Centrômero */}
                <mesh>
                    <sphereGeometry args={[0.12, 16, 16]} />
                    <meshStandardMaterial
                        color="white"
                        emissive="white"
                        emissiveIntensity={0.5}
                    />
                </mesh>
            </group>

            {/* Cromossomo homólogo 2 */}
            <group ref={group2} position={[1.2, 2, 0]} scale={0}>
                {/* Braço superior - parte que vai trocar */}
                <mesh position={[0, 0.4, 0]}>
                    <capsuleGeometry args={[0.08, 0.6, 8, 16]} />
                    <meshStandardMaterial
                        color={exchangeProgress > 0.5 ? mixedColor : color2}
                        emissive={exchangeProgress > 0.5 ? mixedColor : color2}
                        emissiveIntensity={0.3 + exchangeProgress * 0.3}
                    />
                </mesh>

                {/* Braço inferior */}
                <mesh position={[0, -0.4, 0]}>
                    <capsuleGeometry args={[0.08, 0.6, 8, 16]} />
                    <meshStandardMaterial
                        color={color2}
                        emissive={color2}
                        emissiveIntensity={0.3}
                    />
                </mesh>

                {/* Centrômero */}
                <mesh>
                    <sphereGeometry args={[0.12, 16, 16]} />
                    <meshStandardMaterial
                        color="white"
                        emissive="white"
                        emissiveIntensity={0.5}
                    />
                </mesh>
            </group>

            {/* Conexões mostrando a troca genética */}
            {isExchanging && exchangeProgress > 0.2 && (
                <>
                    {/* Ponte de conexão */}
                    <mesh position={[0, 2.4, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.04, 0.04, 2.4 * exchangeProgress, 8]} />
                        <meshStandardMaterial
                            color="#ffff00"
                            emissive="#ffaa00"
                            emissiveIntensity={0.8}
                            transparent
                            opacity={exchangeProgress * 0.8}
                        />
                    </mesh>

                    {/* Partículas de DNA sendo trocadas */}
                    {[...Array(5)].map((_, i) => {
                        const t = (exchangeProgress + i * 0.15) % 1
                        const x = THREE.MathUtils.lerp(-1.2, 1.2, t)
                        const y = 2.4 + Math.sin(t * Math.PI) * 0.3

                        return (
                            <mesh key={i} position={[x, y, 0]}>
                                <sphereGeometry args={[0.06, 8, 8]} />
                                <meshBasicMaterial
                                    color="#ffff00"
                                    transparent
                                    opacity={Math.sin(t * Math.PI) * 0.8}
                                />
                            </mesh>
                        )
                    })}

                    {/* Efeito de brilho */}
                    <pointLight
                        position={[0, 2.4, 0]}
                        color="#ffff00"
                        intensity={exchangeProgress * 2}
                        distance={3}
                    />
                </>
            )}
        </group>
    )
}

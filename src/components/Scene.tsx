import { Float, Stars, Environment, Sparkles } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CellPopulation } from './CellPopulation'
import type { Phase, ModeLevel } from '../types'

interface SceneProps {
    phase: Phase
    mode: ModeLevel
    generation?: number
    isContinuousMode?: boolean
    isPlaying: boolean
    onCellClick?: (id: string, phase: string) => void
}

// Partículas flutuantes de ambiente
function AmbientParticles() {
    const particlesRef = useRef<THREE.Points>(null)
    
    useFrame((state) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02
            particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1
        }
    })

    const particleCount = 200
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 30
        positions[i * 3 + 1] = (Math.random() - 0.5) * 30
        positions[i * 3 + 2] = (Math.random() - 0.5) * 15

        // Cores variadas (azul, roxo, ciano)
        const colorChoice = Math.random()
        if (colorChoice < 0.33) {
            colors[i * 3] = 0.27; colors[i * 3 + 1] = 0.53; colors[i * 3 + 2] = 1 // Azul
        } else if (colorChoice < 0.66) {
            colors[i * 3] = 0.6; colors[i * 3 + 1] = 0.3; colors[i * 3 + 2] = 0.9 // Roxo
        } else {
            colors[i * 3] = 0; colors[i * 3 + 1] = 0.8; colors[i * 3 + 2] = 0.8 // Ciano
        }

        sizes[i] = Math.random() * 0.08 + 0.02
    }

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={particleCount}
                    array={colors}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={particleCount}
                    array={sizes}
                    itemSize={1}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.08}
                vertexColors
                transparent
                opacity={0.6}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    )
}

// Moléculas flutuantes decorativas
function FloatingMolecules() {
    return (
        <>
            {[...Array(8)].map((_, i) => (
                <Float 
                    key={i} 
                    speed={1 + Math.random()} 
                    rotationIntensity={0.5} 
                    floatIntensity={1}
                    position={[
                        (Math.random() - 0.5) * 15,
                        (Math.random() - 0.5) * 10,
                        -5 - Math.random() * 5
                    ]}
                >
                    <group scale={0.3 + Math.random() * 0.2}>
                        {/* Molécula simples (tipo água ou ATP) */}
                        <mesh>
                            <sphereGeometry args={[0.15, 16, 16]} />
                            <meshStandardMaterial 
                                color={i % 2 === 0 ? "#ff6b6b" : "#4ecdc4"}
                                emissive={i % 2 === 0 ? "#ff6b6b" : "#4ecdc4"}
                                emissiveIntensity={0.3}
                                transparent
                                opacity={0.6}
                            />
                        </mesh>
                        <mesh position={[0.2, 0.1, 0]}>
                            <sphereGeometry args={[0.1, 12, 12]} />
                            <meshStandardMaterial 
                                color="#ffffff"
                                transparent
                                opacity={0.5}
                            />
                        </mesh>
                        <mesh position={[-0.2, 0.1, 0]}>
                            <sphereGeometry args={[0.1, 12, 12]} />
                            <meshStandardMaterial 
                                color="#ffffff"
                                transparent
                                opacity={0.5}
                            />
                        </mesh>
                    </group>
                </Float>
            ))}
        </>
    )
}

export function Scene({ mode, isPlaying, onCellClick }: SceneProps) {
    return (
        <group>
            {/* Iluminação Realista */}
            <Environment preset="city" />
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow color="#ffffff" />
            <directionalLight position={[-10, -5, -5]} intensity={0.5} color="#4488ff" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#4488ff" />
            <pointLight position={[10, 5, 10]} intensity={0.8} color="#a855f7" />

            {/* Fundo Estrelado (Microcosmo) */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {/* Sparkles para efeito de brilho */}
            <Sparkles 
                count={100} 
                scale={15} 
                size={2} 
                speed={0.3} 
                color="#4488ff"
                opacity={0.5}
            />
            <Sparkles 
                count={50} 
                scale={12} 
                size={3} 
                speed={0.2} 
                color="#a855f7"
                opacity={0.3}
            />

            {/* Partículas de ambiente */}
            <AmbientParticles />

            {/* Moléculas decorativas no fundo */}
            <FloatingMolecules />

            {/* População de Células Inteligentes */}
            <CellPopulation mode={mode} isPlaying={isPlaying} />

            {/* Partículas de poeira celular */}
            <Float speed={1} rotationIntensity={1} floatIntensity={1}>
                {[...Array(30)].map((_, i) => (
                    <mesh key={i} position={[
                        (Math.random() - 0.5) * 25,
                        (Math.random() - 0.5) * 20,
                        (Math.random() - 0.5) * 12
                    ]}>
                        <sphereGeometry args={[0.03 + Math.random() * 0.03, 8, 8]} />
                        <meshBasicMaterial 
                            color={Math.random() > 0.5 ? "#ffffff" : "#88ccff"} 
                            transparent 
                            opacity={0.2 + Math.random() * 0.3} 
                        />
                    </mesh>
                ))}
            </Float>

            {/* Grade de referência sutil (opcional, para profundidade) */}
            <gridHelper 
                args={[50, 50, '#1a1a3e', '#1a1a3e']} 
                position={[0, -8, 0]} 
                rotation={[0, 0, 0]}
            />
        </group>
    )
}

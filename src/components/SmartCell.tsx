import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Float, Html } from '@react-three/drei'
import * as THREE from 'three'
import { easing } from 'maath'
import { Nucleus } from './Nucleus'
import { Chromosome } from './Chromosome'
import { Organelle } from './Organelle'
import { CleavageFurrow } from './CleavageFurrow'
import { DNAReplication } from './DNAReplication'
import { CellTooltip } from './CellTooltip'
import { Centriole } from './Centriole'
import { SpindleFibers } from './SpindleFibers'
import { Chromatin } from './Chromatin'
import { MovementTrail } from './MovementTrail'
import type { ModeLevel, Phase } from '../types'
import { getPhasesForMode } from '../types'

interface SmartCellProps {
    id: string
    initialPosition: [number, number, number]
    generation: number
    mode: ModeLevel
    isPlaying: boolean
    globalPhase?: Phase
    onCellClick?: (id: string, phase: string) => void
    onDivide: (parentPos: THREE.Vector3, gen: number) => void
    onDeath: (id: string) => void
    onRegister?: (id: string, ref: THREE.Group) => void
    onUnregister?: (id: string) => void
}

export function SmartCell({ id, initialPosition, generation, mode, isPlaying, globalPhase, onCellClick, onDivide, onDeath, onRegister, onUnregister }: SmartCellProps) {
    const groupRef = useRef<THREE.Group>(null)

    // Registra a célula no sistema de física
    useEffect(() => {
        if (groupRef.current && onRegister) {
            onRegister(id, groupRef.current)
        }
        return () => {
            if (onUnregister) onUnregister(id)
        }
    }, [id, onRegister, onUnregister])

    const [timer, setTimer] = useState(0)
    const [isDead, setIsDead] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const hasDivided = useRef(false)

    const lifeSpan = useRef(Math.random() * 20 + 60)
    const growthFactor = useRef(1)

    const nuclearOpacity = useRef(1)
    const chromatinOpacity = useRef(1)
    const chromosomeOpacity = useRef(0)
    const spindleOpacity = useRef(0)
    const centrioleDist = useRef(0.2)

    const phases = useMemo(() => getPhasesForMode(mode), [mode])
    const cycleTime = 20
    const phaseTime = cycleTime / phases.length

    useEffect(() => {
        if (!isPlaying && globalPhase) {
            const targetIndex = phases.indexOf(globalPhase)
            if (targetIndex !== -1) {
                setTimer(targetIndex * phaseTime + 0.1)
            }
        }
    }, [globalPhase, isPlaying, phases, phaseTime])

    const currentPhaseIndex = Math.floor((timer % cycleTime) / phaseTime) % phases.length
    const phase = phases[currentPhaseIndex]
    const prevPhaseRef = useRef(phase)

    const centriolePos1 = useRef(new THREE.Vector3(0, 0, 0))
    const centriolePos2 = useRef(new THREE.Vector3(0, 0, 0))

    useFrame((state, delta) => {
        if (!groupRef.current || isDead) return

        if (isPlaying) {
            if (timer > lifeSpan.current) {
                setIsDead(true)
                onDeath(id)
                return
            }
            setTimer(prev => prev + delta)
        }

        const dt = Math.min(delta, 0.1) * 2

        const isInterphase = phase.includes('Intérfase') || phase.includes('G1') || phase.includes('S') || phase.includes('G2')
        const isProphase = phase.includes('Prófase')
        const isPrometaphase = phase.includes('Prometáfase')
        const isMetaphase = phase === 'Metáfase'
        const isAnaphase = phase.includes('Anáfase')
        const isTelophase = phase.includes('Telófase')

        let targetScale = 1
        if (phase.includes('G1')) targetScale = 0.8
        else if (phase.includes('G2')) targetScale = 1.2

        growthFactor.current = THREE.MathUtils.lerp(growthFactor.current, targetScale, dt * 0.5)

        if (isInterphase) {
            easing.damp(nuclearOpacity, 'current', 0.6, dt)
            easing.damp(chromatinOpacity, 'current', 1, dt)
            easing.damp(chromosomeOpacity, 'current', 0, dt)
            easing.damp(spindleOpacity, 'current', 0, dt)
            easing.damp(centrioleDist, 'current', 0.2, dt)
        }
        else if (isProphase) {
            easing.damp(nuclearOpacity, 'current', 0, dt * 0.5)
            easing.damp(chromatinOpacity, 'current', 0, dt)
            easing.damp(chromosomeOpacity, 'current', 1, dt)
            easing.damp(spindleOpacity, 'current', 0.3, dt)
            easing.damp(centrioleDist, 'current', 1.5, dt * 0.5)
        }
        else if (isMetaphase || isPrometaphase) {
            easing.damp(spindleOpacity, 'current', 0.8, dt)
            easing.damp(centrioleDist, 'current', 2.0, dt)
        }
        else if (isAnaphase) {
            easing.damp(spindleOpacity, 'current', 1, dt)
        }
        else if (isTelophase) {
            easing.damp(nuclearOpacity, 'current', 0.6, dt)
            easing.damp(chromatinOpacity, 'current', 1, dt)
            easing.damp(chromosomeOpacity, 'current', 0, dt)
            easing.damp(spindleOpacity, 'current', 0, dt)
        }

        centriolePos1.current.set(-centrioleDist.current / 2, 0, 0)
        centriolePos2.current.set(centrioleDist.current / 2, 0, 0)

        groupRef.current.scale.setScalar(growthFactor.current)

        const time = state.clock.elapsedTime
        groupRef.current.position.x = initialPosition[0] + Math.sin(time * 0.2 + id.length) * 0.2
        groupRef.current.position.y = initialPosition[1] + Math.cos(time * 0.15 + id.length) * 0.2

        if (isPlaying && prevPhaseRef.current === 'Citocinese' && phase !== 'Citocinese') {
            if (!hasDivided.current) {
                hasDivided.current = true
                onDivide(groupRef.current.position.clone(), generation + 1)
            }
        }
        prevPhaseRef.current = phase
    })

    const showNucleus = nuclearOpacity.current > 0.01
    const showChromatin = chromatinOpacity.current > 0.01
    const showChromosomes = chromosomeOpacity.current > 0.01
    const showSpindle = spindleOpacity.current > 0.01
    const showReplication = phase.includes('S')
    const showFurrow = phase.includes('Citocinese')

    // Cores baseadas na fase
    const getCellColor = () => {
        if (phase.includes('S')) return '#22c55e' // Verde durante replicação
        if (phase.includes('Prófase')) return '#a855f7' // Roxo
        if (phase.includes('Metáfase')) return '#3b82f6' // Azul
        if (phase.includes('Anáfase')) return '#ef4444' // Vermelho
        if (phase.includes('Telófase') || phase.includes('Citocinese')) return '#f97316' // Laranja
        return '#4488ff' // Azul padrão
    }

    return (
        <group ref={groupRef} position={initialPosition}>
            <pointLight position={[0, 0, 0]} intensity={2.5} distance={4} decay={2} color={getCellColor()} />

            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                {/* Membrana plasmática externa (bicamada lipídica) */}
                <Sphere args={[1.25, 64, 64]}
                    onPointerOver={(e) => { e.stopPropagation(); setIsHovered(true) }}
                    onPointerOut={(e) => { e.stopPropagation(); setIsHovered(false) }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onCellClick) onCellClick(id, phase)
                    }}
                >
                    <meshPhysicalMaterial
                        color={isHovered ? "#ffffff" : getCellColor()}
                        transparent
                        opacity={isHovered ? 0.2 : 0.15}
                        roughness={0.1}
                        metalness={0}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                        transmission={0.3}
                        thickness={0.5}
                    />
                </Sphere>

                {/* Citoplasma interno */}
                <Sphere args={[1.18, 48, 48]}>
                    <meshPhysicalMaterial
                        color="#88ccff"
                        transparent
                        opacity={0.08}
                        roughness={0.5}
                        metalness={0}
                    />
                </Sphere>

                {/* Glow baseado na fase */}
                <Sphere args={[1.3, 16, 16]}>
                    <meshBasicMaterial
                        color={getCellColor()}
                        transparent
                        opacity={0.05}
                    />
                </Sphere>

                <group scale={showNucleus ? 1 : 0}>
                    <Nucleus visible={showNucleus} opacity={nuclearOpacity.current} />
                    {showChromatin && <Chromatin opacity={chromatinOpacity.current} />}
                </group>

                <Centriole position={centriolePos1.current.toArray()} />
                <Centriole position={centriolePos2.current.toArray()} />

                {showSpindle && (
                    <SpindleFibers
                        startPos={centriolePos1.current}
                        endPos={centriolePos2.current}
                        opacity={spindleOpacity.current}
                        tension={phase.includes('Anáfase') ? 0.9 : 0.5}
                    />
                )}

                {showChromosomes && (
                    <group>
                        {/* Múltiplos cromossomos em diferentes posições */}
                        <Chromosome
                            position={[0, 0.2, 0]}
                            rotation={[0, 0, Math.PI / 2]}
                            phase={phase}
                            opacity={chromosomeOpacity.current}
                            color="#9d4edd"
                        />
                        <Chromosome
                            position={[0, -0.2, 0.1]}
                            rotation={[0.2, 0, Math.PI / 2.2]}
                            phase={phase}
                            opacity={chromosomeOpacity.current}
                            color="#7c3aed"
                        />
                        <Chromosome
                            position={[0.1, 0, -0.15]}
                            rotation={[-0.1, 0, Math.PI / 1.8]}
                            phase={phase}
                            opacity={chromosomeOpacity.current}
                            color="#a855f7"
                        />
                        <Chromosome
                            position={[-0.1, 0.1, 0.1]}
                            rotation={[0.15, 0.1, Math.PI / 2.1]}
                            phase={phase}
                            opacity={chromosomeOpacity.current}
                            color="#8b5cf6"
                        />
                    </group>
                )}

                {phase.includes('Anáfase') && (
                    <>
                        <MovementTrail
                            startPos={new THREE.Vector3(0, 0, 0)}
                            endPos={new THREE.Vector3(-2, 0, 0)}
                            color="#9d4edd"
                            opacity={0.5}
                        />
                        <MovementTrail
                            startPos={new THREE.Vector3(0, 0, 0)}
                            endPos={new THREE.Vector3(2, 0, 0)}
                            color="#9d4edd"
                            opacity={0.5}
                        />
                    </>
                )}

                {showReplication && <DNAReplication phase={phase} />}
                {showFurrow && <CleavageFurrow phase={phase} />}

                {/* Organelas sempre visíveis mas com intensidade variável */}
                <group>
                    <Organelle type="mitochondria" position={[-0.6, 0.6, 0.4]} phase={phase} />
                    <Organelle type="mitochondria" position={[0.5, -0.5, -0.3]} phase={phase} />
                    <Organelle type="golgi" position={[0.6, -0.4, 0]} phase={phase} />
                    <Organelle type="golgi" position={[-0.4, -0.6, 0.2]} phase={phase} />
                </group>

                {/* Ribossomos (pequenos pontos no citoplasma) */}
                {[...Array(15)].map((_, i) => {
                    const theta = (i / 15) * Math.PI * 2
                    const phi = Math.acos(2 * Math.random() - 1)
                    const r = 0.8 + Math.random() * 0.3
                    return (
                        <mesh 
                            key={`ribosome-${i}`}
                            position={[
                                r * Math.sin(phi) * Math.cos(theta),
                                r * Math.sin(phi) * Math.sin(theta),
                                r * Math.cos(phi)
                            ]}
                        >
                            <sphereGeometry args={[0.02, 8, 8]} />
                            <meshStandardMaterial 
                                color="#ff9500" 
                                emissive="#ff9500"
                                emissiveIntensity={0.3}
                            />
                        </mesh>
                    )
                })}
            </Float>

            {isHovered && (
                <Html position={[0, 0, 0]} zIndexRange={[0, 50]} style={{ pointerEvents: 'none' }}>
                    <div style={{ width: '300px', transform: 'translate3d(-50%, -100%, 0)' }}>
                        <CellTooltip
                            phase={phase}
                            position={[0, 0]}
                            cellIndex={parseInt(id)}
                            elapsedTime={timer}
                        />
                    </div>
                </Html>
            )}
        </group>
    )
}

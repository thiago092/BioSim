import { useRef, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import { easing } from 'maath'
import * as THREE from 'three'
import { Nucleus } from './Nucleus'
import { Chromosome } from './Chromosome'
import { CellTooltip } from './CellTooltip'
import type { Phase, ModeLevel } from '../types'
import { getPhasesForMode } from '../types'

interface MultiGenerationCellsProps {
    generation: number
    isActive: boolean
    mode: ModeLevel
}

export function MultiGenerationCells({ generation, isActive, mode }: MultiGenerationCellsProps) {
    const groupRef = useRef<THREE.Group>(null)
    const cellTimers = useRef<number[]>([])
    const [selectedCell, setSelectedCell] = useState<number | null>(null)
    const [tooltipPos, setTooltipPos] = useState<[number, number]>([0, 0])
    const { camera, size } = useThree()

    const cellPositions = useMemo(() => {
        if (generation === 0) return []

        const totalCells = Math.pow(2, generation)
        const positions: Array<{ x: number; y: number; z: number; gen: number; offset: number }> = []

        const layerRadius = 10
        const angleStep = (Math.PI * 2) / Math.max(totalCells, 8)

        for (let i = 0; i < totalCells; i++) {
            const angle = i * angleStep
            const layer = Math.floor(i / 8)
            const radiusOffset = layer * 4

            positions.push({
                x: Math.cos(angle) * (layerRadius + radiusOffset),
                y: Math.sin(angle) * (layerRadius + radiusOffset),
                z: (Math.random() - 0.5) * 2,
                gen: generation,
                offset: i * 2
            })
        }

        if (cellTimers.current.length !== totalCells) {
            cellTimers.current = positions.map(p => p.offset)
        }

        return positions
    }, [generation])

    const getColorForGeneration = (gen: number) => {
        const colors = ['#4488ff', '#00ffff', '#00ff88', '#ffff00', '#ff8800', '#ff0055']
        return colors[Math.min(gen - 1, colors.length - 1)]
    }

    const getCellPhase = (timer: number): Phase => {
        const phases = getPhasesForMode(mode)
        const cycleTime = 14
        const phaseTime = cycleTime / phases.length

        const currentPhaseIndex = Math.floor((timer % cycleTime) / phaseTime) % phases.length
        return phases[currentPhaseIndex]
    }

    const handleCellClick = (index: number, cellPos: THREE.Vector3) => {
        setSelectedCell(index)

        const vector = cellPos.clone().project(camera)
        const x = (vector.x * 0.5 + 0.5) * size.width
        const y = (-(vector.y) * 0.5 + 0.5) * size.height

        setTooltipPos([x, y])
    }

    useFrame((_, delta) => {
        if (groupRef.current) {
            const targetScale = isActive && generation > 0 ? 1 : 0
            easing.damp3(groupRef.current.scale, [targetScale, targetScale, targetScale], 0.5, delta)

            if (isActive) {
                groupRef.current.rotation.z += delta * 0.05
                cellTimers.current = cellTimers.current.map(timer => timer + delta)
            }
        }
    })

    if (generation === 0) return null

    const showNucleusPhases = ['Intérfase', 'Intérfase-G1', 'Intérfase-S', 'Intérfase-G2', 'Intérfase-Pré-Meiótica', 'Prófase', 'Prófase-Inicial']
    const showChromosomesPhases = ['Prófase', 'Prófase-Inicial', 'Prófase-Tardia', 'Prometáfase', 'Metáfase', 'Metáfase-I', 'Metáfase-II',
        'Anáfase', 'Anáfase-A', 'Anáfase-B', 'Anáfase-I', 'Anáfase-II',
        'Telófase', 'Telófase-I', 'Telófase-II', 'Prófase-I', 'Prófase-II', 'Crossing-Over']

    return (
        <>
            <group ref={groupRef} scale={0}>
                {cellPositions.map((pos, i) => {
                    const cellPhase = getCellPhase(cellTimers.current[i] || pos.offset)
                    const showNucleus = showNucleusPhases.includes(cellPhase)
                    const showChromosomes = showChromosomesPhases.includes(cellPhase)
                    const isSelected = selectedCell === i

                    return (
                        <group
                            key={`gen-cell-${generation}-${i}`}
                            position={[pos.x, pos.y, pos.z]}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleCellClick(i, new THREE.Vector3(pos.x, pos.y, pos.z))
                            }}
                        >
                            <Sphere args={[1.2, 16, 16]}>
                                <meshStandardMaterial
                                    color={getColorForGeneration(pos.gen)}
                                    transparent
                                    opacity={0.15}
                                    roughness={0.3}
                                />
                            </Sphere>

                            {isSelected && (
                                <Sphere args={[1.35, 16, 16]}>
                                    <meshBasicMaterial
                                        color="#ffcc00"
                                        transparent
                                        opacity={0.3}
                                        wireframe
                                    />
                                </Sphere>
                            )}

                            {showNucleus && (
                                <group scale={0.4}>
                                    <Nucleus visible={true} />
                                </group>
                            )}

                            {showChromosomes && (
                                <>
                                    {[0, 1, 2, 3].map((chrIndex) => {
                                        const angle = (chrIndex / 4) * Math.PI * 2
                                        let radius = 0.4
                                        if (cellPhase.includes('Metáfase')) radius = 0.2
                                        else if (cellPhase.includes('Anáfase') || cellPhase.includes('Telófase')) radius = 0.6

                                        const chrColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00']

                                        return (
                                            <Chromosome
                                                key={`chr-${i}-${chrIndex}`}
                                                position={[
                                                    Math.cos(angle) * radius,
                                                    Math.sin(angle) * radius,
                                                    0
                                                ]}
                                                rotation={[0, 0, angle]}
                                                color={chrColors[chrIndex]}
                                                phase={cellPhase}
                                            />
                                        )
                                    })}
                                </>
                            )}

                            <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                                <ringGeometry args={[0.08, 0.12, 16]} />
                                <meshBasicMaterial
                                    color={showChromosomes ? '#ff0000' : showNucleus ? '#00ff00' : '#ffffff'}
                                    transparent
                                    opacity={0.8}
                                />
                            </mesh>
                        </group>
                    )
                })}
            </group>

            {selectedCell !== null && cellPositions[selectedCell] && (
                <CellTooltip
                    phase={getCellPhase(cellTimers.current[selectedCell] || cellPositions[selectedCell].offset)}
                    position={tooltipPos}
                    cellIndex={selectedCell}
                    elapsedTime={cellTimers.current[selectedCell] % 2}
                />
            )}
        </>
    )
}

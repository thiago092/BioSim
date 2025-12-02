import { useState, useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SmartCell } from './SmartCell'
import type { ModeLevel, Phase } from '../types'

interface CellPopulationProps {
    mode: ModeLevel
    isPlaying: boolean
    phase: Phase // Fase global para sincronização manual
    onCellClick?: (id: string, phase: string) => void
}

interface CellData {
    id: string
    position: [number, number, number]
    generation: number
}

export function CellPopulation({ mode, isPlaying, phase, onCellClick }: CellPopulationProps) {
    const [cells, setCells] = useState<CellData[]>([
        { id: '0', position: [0, 0, 0], generation: 0 }
    ])

    // Contador para IDs únicos
    const nextId = useRef(1)

    // Sistema de Física: Referências e Velocidades
    const cellRefs = useRef<Record<string, THREE.Group>>({})
    const velocities = useRef<Record<string, THREE.Vector3>>({})

    const registerCell = useCallback((id: string, ref: THREE.Group) => {
        cellRefs.current[id] = ref
        if (!velocities.current[id]) velocities.current[id] = new THREE.Vector3(0, 0, 0)
    }, [])

    const unregisterCell = useCallback((id: string) => {
        delete cellRefs.current[id]
        delete velocities.current[id]
    }, [])

    // Loop de Física: Verlet/Euler Integration para movimento orgânico suave
    useFrame((state, delta) => {
        const ids = Object.keys(cellRefs.current)
        const repulsionRadius = 3.2 // Raio de interação
        const repulsionStrength = 15.0 // Força de empurrão
        const centerAttraction = 0.8 // Força que puxa para o centro (gravidade da colônia)
        const damping = 0.9 // Atrito (quanto menor, mais "viscoso" o movimento)
        const dt = Math.min(delta, 0.05) // Limitador de tempo para estabilidade

        // 1. Calcular Forças
        const forces: Record<string, THREE.Vector3> = {}

        ids.forEach(id => {
            forces[id] = new THREE.Vector3(0, 0, 0)
            const cell = cellRefs.current[id]
            if (cell) {
                // Atração suave ao centro para manter a colônia unida
                forces[id].add(cell.position.clone().multiplyScalar(-centerAttraction))
            }
        })

        for (let i = 0; i < ids.length; i++) {
            const idA = ids[i]
            const cellA = cellRefs.current[idA]
            if (!cellA) continue

            for (let j = i + 1; j < ids.length; j++) {
                const idB = ids[j]
                const cellB = cellRefs.current[idB]
                if (!cellB) continue

                const diff = new THREE.Vector3().subVectors(cellA.position, cellB.position)
                const dist = diff.length()

                if (dist < repulsionRadius) {
                    const dir = diff.normalize()
                    if (dir.lengthSq() === 0) dir.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize()

                    // Força de mola suave
                    const forceMag = repulsionStrength * (1 - dist / repulsionRadius)
                    const force = dir.multiplyScalar(forceMag)

                    forces[idA].add(force)
                    forces[idB].sub(force)
                }
            }
        }

        // 2. Atualizar Velocidade e Posição
        ids.forEach(id => {
            const cell = cellRefs.current[id]
            const vel = velocities.current[id]
            const force = forces[id]

            if (cell && vel && force) {
                // F = ma (assumindo m=1) -> a = F
                vel.add(force.multiplyScalar(dt))
                vel.multiplyScalar(damping) // Aplica atrito
                cell.position.add(vel.clone().multiplyScalar(dt))
            }
        })
    })

    // Callback unificado para divisão
    const handleCellDivision = useCallback((parentId: string, parentPos: THREE.Vector3, gen: number) => {
        setCells(prev => {
            // Limite de segurança
            if (prev.length > 32) return prev

            // Remove a mãe
            const filtered = prev.filter(c => c.id !== parentId)

            // Cria filhas com offset aleatório para evitar colisão linear inicial
            const angle = Math.random() * Math.PI * 2
            const offset = 1.0 // Reduzi o offset inicial pois a física vai empurrar
            const dx = Math.cos(angle) * offset
            const dy = Math.sin(angle) * offset
            const dz = (Math.random() - 0.5) * offset

            const daughter1: CellData = {
                id: `${nextId.current++}`,
                position: [parentPos.x - dx, parentPos.y - dy, parentPos.z - dz],
                generation: gen
            }
            const daughter2: CellData = {
                id: `${nextId.current++}`,
                position: [parentPos.x + dx, parentPos.y + dy, parentPos.z + dz],
                generation: gen
            }

            return [...filtered, daughter1, daughter2]
        })
    }, [])

    const handleDeath = useCallback((deadId: string) => {
        setCells(prev => prev.filter(c => c.id !== deadId))
    }, [])

    return (
        <group>
            {cells.map(cell => (
                <SmartCell
                    key={cell.id}
                    id={cell.id}
                    initialPosition={cell.position}
                    generation={cell.generation}
                    mode={mode}
                    isPlaying={isPlaying}
                    globalPhase={phase}
                    onCellClick={onCellClick}
                    onDivide={(pos, gen) => handleCellDivision(cell.id, pos, gen)}
                    onDeath={handleDeath}
                    onRegister={registerCell}
                    onUnregister={unregisterCell}
                />
            ))}
        </group>
    )
}

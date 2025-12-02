import { Sphere } from '@react-three/drei'
import type { Phase } from '../types'

interface CentriolesProps {
    phase: Phase
}

export function Centrioles({ phase }: CentriolesProps) {
    const visible = phase !== 'Intérfase'

    if (!visible) return null

    return (
        <>
            {/* Left centriole pair */}
            <group position={[-2.5, 0, 0]}>
                <Sphere args={[0.15, 16, 16]} position={[-0.1, 0, 0]}>
                    <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={0.5} />
                </Sphere>
                <Sphere args={[0.15, 16, 16]} position={[0.1, 0, 0]}>
                    <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={0.5} />
                </Sphere>
            </group>

            {/* Right centriole pair */}
            <group position={[2.5, 0, 0]}>
                <Sphere args={[0.15, 16, 16]} position={[-0.1, 0, 0]}>
                    <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={0.5} />
                </Sphere>
                <Sphere args={[0.15, 16, 16]} position={[0.1, 0, 0]}>
                    <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={0.5} />
                </Sphere>
            </group>
        </>
    )
}

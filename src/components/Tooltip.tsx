import { Html } from '@react-three/drei'
import { useState } from 'react'

interface TooltipProps {
    label: string
    description?: string
    position?: [number, number, number]
}

export function Tooltip({ label, description, position = [0, 0, 0] }: TooltipProps) {
    const [hidden, set] = useState(true)

    return (
        <group position={position}>
            <mesh
                visible={false}
                onPointerOver={() => set(false)}
                onPointerOut={() => set(true)}
            >
                <sphereGeometry args={[0.5, 16, 16]} />
            </mesh>

            <Html
                style={{
                    transition: 'all 0.2s',
                    opacity: hidden ? 0 : 1,
                    transform: `scale(${hidden ? 0.5 : 1})`,
                    pointerEvents: 'none',
                }}
                distanceFactor={10}
            >
                <div style={{
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(4px)',
                }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{label}</div>
                    {description && <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>{description}</div>}
                </div>
            </Html>
        </group>
    )
}

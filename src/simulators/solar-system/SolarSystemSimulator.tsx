import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Html } from '@react-three/drei'
import { Suspense, useState, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Home, Play, Pause, RotateCcw, X, Eye, EyeOff } from 'lucide-react'
import * as THREE from 'three'

// Dados dos planetas com mais detalhes
const PLANETS_DATA = [
    {
        name: 'Mercúrio',
        radius: 0.2,
        distance: 4,
        orbitSpeed: 4.15,
        rotationSpeed: 0.017,
        color: '#b5b5b5',
        emissive: '#3d3d3d',
        tilt: 0.03,
        moons: [] as { name: string; radius: number; distance: number; speed: number; color: string }[],
        info: {
            diameter: '4.879 km',
            dayLength: '59 dias',
            yearLength: '88 dias',
            moonsCount: 0,
            temperature: '-180°C a 430°C',
            fact: '🔥 Planeta mais próximo do Sol, mas não o mais quente!'
        }
    },
    {
        name: 'Vênus',
        radius: 0.45,
        distance: 6,
        orbitSpeed: 1.62,
        rotationSpeed: -0.004,
        color: '#e8cda0',
        emissive: '#8b7355',
        tilt: 177.4 * Math.PI / 180,
        atmosphere: '#ffdd99',
        moons: [] as { name: string; radius: number; distance: number; speed: number; color: string }[],
        info: {
            diameter: '12.104 km',
            dayLength: '243 dias',
            yearLength: '225 dias',
            moonsCount: 0,
            temperature: '465°C',
            fact: '🌡️ Planeta mais quente! Gira ao contrário.'
        }
    },
    {
        name: 'Terra',
        radius: 0.5,
        distance: 8,
        orbitSpeed: 1,
        rotationSpeed: 1,
        color: '#6b93d6',
        emissive: '#1a4d1a',
        tilt: 23.5 * Math.PI / 180,
        atmosphere: '#87ceeb',
        moons: [{ name: 'Lua', radius: 0.12, distance: 0.8, speed: 3, color: '#c0c0c0' }],
        info: {
            diameter: '12.742 km',
            dayLength: '24 horas',
            yearLength: '365 dias',
            moonsCount: 1,
            temperature: '-89°C a 57°C',
            fact: '🌍 Único planeta com vida conhecida!'
        }
    },
    {
        name: 'Marte',
        radius: 0.3,
        distance: 10.5,
        orbitSpeed: 0.53,
        rotationSpeed: 0.97,
        color: '#c1440e',
        emissive: '#4a1a00',
        tilt: 25.2 * Math.PI / 180,
        moons: [
            { name: 'Fobos', radius: 0.05, distance: 0.5, speed: 5, color: '#8b7355' },
            { name: 'Deimos', radius: 0.03, distance: 0.7, speed: 3, color: '#8b7355' }
        ],
        info: {
            diameter: '6.779 km',
            dayLength: '24h 37min',
            yearLength: '687 dias',
            moonsCount: 2,
            temperature: '-87°C a -5°C',
            fact: '🌋 Tem o maior vulcão do Sistema Solar: Monte Olimpo!'
        }
    },
    {
        name: 'Júpiter',
        radius: 1.8,
        distance: 16,
        orbitSpeed: 0.084,
        rotationSpeed: 2.4,
        color: '#d4a574',
        emissive: '#4a3728',
        tilt: 3.1 * Math.PI / 180,
        bands: true,
        greatSpot: true,
        moons: [
            { name: 'Io', radius: 0.12, distance: 2.5, speed: 4, color: '#ffcc00' },
            { name: 'Europa', radius: 0.1, distance: 3, speed: 3, color: '#b8d4e8' },
            { name: 'Ganimedes', radius: 0.15, distance: 3.6, speed: 2, color: '#a0a0a0' },
            { name: 'Calisto', radius: 0.13, distance: 4.2, speed: 1.5, color: '#6b5b4f' }
        ],
        info: {
            diameter: '139.820 km',
            dayLength: '10 horas',
            yearLength: '12 anos',
            moonsCount: 95,
            temperature: '-145°C',
            fact: '🌀 A Grande Mancha Vermelha é uma tempestade maior que a Terra!'
        }
    },
    {
        name: 'Saturno',
        radius: 1.5,
        distance: 22,
        orbitSpeed: 0.034,
        rotationSpeed: 2.2,
        color: '#f4d59e',
        emissive: '#5a4a28',
        tilt: 26.7 * Math.PI / 180,
        rings: {
            innerRadius: 1.8,
            outerRadius: 3.2,
            color: '#d4b896',
            opacity: 0.85
        },
        moons: [
            { name: 'Titã', radius: 0.18, distance: 3.8, speed: 2, color: '#daa520' },
            { name: 'Encélado', radius: 0.06, distance: 2.8, speed: 4, color: '#ffffff' }
        ],
        info: {
            diameter: '116.460 km',
            dayLength: '10,7 horas',
            yearLength: '29 anos',
            moonsCount: 146,
            temperature: '-178°C',
            fact: '💍 Seus anéis são feitos de bilhões de partículas de gelo!'
        }
    },
    {
        name: 'Urano',
        radius: 0.9,
        distance: 28,
        orbitSpeed: 0.012,
        rotationSpeed: -1.4,
        color: '#b5e3e3',
        emissive: '#2a5555',
        tilt: 97.8 * Math.PI / 180,
        rings: {
            innerRadius: 1.1,
            outerRadius: 1.5,
            color: '#4a6a6a',
            opacity: 0.4
        },
        moons: [] as { name: string; radius: number; distance: number; speed: number; color: string }[],
        info: {
            diameter: '50.724 km',
            dayLength: '17 horas',
            yearLength: '84 anos',
            moonsCount: 28,
            temperature: '-224°C',
            fact: '🔄 Gira "deitado" - seu eixo é quase horizontal!'
        }
    },
    {
        name: 'Netuno',
        radius: 0.85,
        distance: 34,
        orbitSpeed: 0.006,
        rotationSpeed: 1.5,
        color: '#4b70dd',
        emissive: '#1a2a5a',
        tilt: 28.3 * Math.PI / 180,
        moons: [
            { name: 'Tritão', radius: 0.1, distance: 1.5, speed: -2, color: '#d4a0a0' }
        ],
        info: {
            diameter: '49.244 km',
            dayLength: '16 horas',
            yearLength: '165 anos',
            moonsCount: 16,
            temperature: '-218°C',
            fact: '💨 Ventos mais fortes do Sistema Solar: 2.100 km/h!'
        }
    }
]

// Sol melhorado
function Sun() {
    const meshRef = useRef<THREE.Mesh>(null)
    const coronaRef = useRef<THREE.Mesh>(null)
    const glowRef = useRef<THREE.Mesh>(null)
    
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.05
        }
        if (coronaRef.current) {
            coronaRef.current.rotation.z += delta * 0.02
            coronaRef.current.rotation.x += delta * 0.01
        }
        if (glowRef.current) {
            const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02
            glowRef.current.scale.setScalar(scale)
        }
    })

    return (
        <group>
            {/* Núcleo do Sol */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshBasicMaterial color="#fdb813" />
            </mesh>
            
            {/* Superfície com detalhes */}
            <mesh>
                <sphereGeometry args={[2.01, 64, 64]} />
                <meshBasicMaterial 
                    color="#ff8c00" 
                    transparent 
                    opacity={0.6}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Corona */}
            <mesh ref={coronaRef}>
                <sphereGeometry args={[2.3, 32, 32]} />
                <meshBasicMaterial 
                    color="#ffaa00" 
                    transparent 
                    opacity={0.15}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Glow externo */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[2.8, 32, 32]} />
                <meshBasicMaterial 
                    color="#ff6600" 
                    transparent 
                    opacity={0.08}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Luz do Sol */}
            <pointLight position={[0, 0, 0]} intensity={3} color="#fff5e0" distance={100} decay={0.5} />
            <pointLight position={[0, 0, 0]} intensity={1} color="#ff8800" distance={50} decay={1} />
        </group>
    )
}

// Componente Lua
function Moon({ data, parentRef, isPlaying, speedMultiplier }: {
    data: { name: string; radius: number; distance: number; speed: number; color: string }
    parentRef: React.RefObject<THREE.Group | null>
    isPlaying: boolean
    speedMultiplier: number
}) {
    const meshRef = useRef<THREE.Mesh>(null)
    const angleRef = useRef(Math.random() * Math.PI * 2)

    useFrame((_, delta) => {
        if (!isPlaying || !meshRef.current || !parentRef.current) return
        angleRef.current += delta * data.speed * 0.5 * speedMultiplier
        const parentPos = parentRef.current.position
        meshRef.current.position.x = parentPos.x + Math.cos(angleRef.current) * data.distance
        meshRef.current.position.z = parentPos.z + Math.sin(angleRef.current) * data.distance
        meshRef.current.position.y = parentPos.y + Math.sin(angleRef.current * 0.5) * 0.1
    })

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[data.radius, 16, 16]} />
            <meshStandardMaterial color={data.color} roughness={0.8} />
        </mesh>
    )
}

// Anéis de planeta
function PlanetRings({ innerRadius, outerRadius, color, opacity }: {
    innerRadius: number
    outerRadius: number
    color: string
    opacity: number
}) {
    return (
        <group rotation={[Math.PI / 2.5, 0, 0]}>
            {/* Anel principal */}
            <mesh>
                <ringGeometry args={[innerRadius, outerRadius, 128]} />
                <meshStandardMaterial 
                    color={color} 
                    transparent 
                    opacity={opacity} 
                    side={THREE.DoubleSide}
                    roughness={0.6}
                />
            </mesh>
            {/* Detalhes dos anéis */}
            <mesh>
                <ringGeometry args={[innerRadius * 1.1, innerRadius * 1.3, 128]} />
                <meshStandardMaterial 
                    color={color} 
                    transparent 
                    opacity={opacity * 0.6} 
                    side={THREE.DoubleSide}
                />
            </mesh>
            <mesh>
                <ringGeometry args={[outerRadius * 0.85, outerRadius * 0.95, 128]} />
                <meshStandardMaterial 
                    color={color} 
                    transparent 
                    opacity={opacity * 0.4} 
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    )
}

// Tipo para planeta
type PlanetData = typeof PLANETS_DATA[0]

// Planeta melhorado
function Planet({ 
    data, 
    isPlaying, 
    speedMultiplier,
    onSelect,
    isSelected,
    showOrbits,
    showLabels
}: { 
    data: PlanetData
    isPlaying: boolean
    speedMultiplier: number
    onSelect: () => void
    isSelected: boolean
    showOrbits: boolean
    showLabels: boolean
}) {
    const groupRef = useRef<THREE.Group>(null)
    const meshRef = useRef<THREE.Mesh>(null)
    const atmosphereRef = useRef<THREE.Mesh>(null)
    const angleRef = useRef(Math.random() * Math.PI * 2)

    useFrame((_, delta) => {
        if (!isPlaying) return
        
        // Órbita
        angleRef.current += delta * data.orbitSpeed * 0.15 * speedMultiplier
        if (groupRef.current) {
            groupRef.current.position.x = Math.cos(angleRef.current) * data.distance
            groupRef.current.position.z = Math.sin(angleRef.current) * data.distance
        }
        
        // Rotação própria
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * data.rotationSpeed * 0.3 * speedMultiplier
        }

        // Animação da atmosfera
        if (atmosphereRef.current && 'atmosphere' in data) {
            atmosphereRef.current.rotation.y += delta * 0.1
        }
    })

    return (
        <>
            {/* Órbita visual */}
            {showOrbits && (
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[data.distance - 0.03, data.distance + 0.03, 256]} />
                    <meshBasicMaterial 
                        color={isSelected ? data.color : '#ffffff'} 
                        transparent 
                        opacity={isSelected ? 0.4 : 0.1} 
                        side={THREE.DoubleSide} 
                    />
                </mesh>
            )}

            {/* Planeta e suas luas */}
            <group ref={groupRef} position={[data.distance, 0, 0]}>
                {/* Inclinação do eixo */}
                <group rotation={[0, 0, data.tilt]}>
                    {/* Planeta */}
                    <mesh 
                        ref={meshRef} 
                        onClick={(e) => { e.stopPropagation(); onSelect() }}
                        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' }}
                        onPointerOut={() => { document.body.style.cursor = 'default' }}
                    >
                        <sphereGeometry args={[data.radius, 64, 64]} />
                        <meshStandardMaterial 
                            color={data.color}
                            emissive={data.emissive}
                            emissiveIntensity={isSelected ? 0.4 : 0.1}
                            roughness={0.7}
                            metalness={0.1}
                        />
                    </mesh>

                    {/* Grande Mancha Vermelha (Júpiter) */}
                    {'greatSpot' in data && data.greatSpot && (
                        <mesh position={[data.radius * 0.7, -data.radius * 0.3, data.radius * 0.5]}>
                            <sphereGeometry args={[data.radius * 0.25, 16, 16]} />
                            <meshStandardMaterial color="#cc4444" roughness={0.8} />
                        </mesh>
                    )}

                    {/* Atmosfera */}
                    {'atmosphere' in data && data.atmosphere && (
                        <mesh ref={atmosphereRef}>
                            <sphereGeometry args={[data.radius * 1.08, 32, 32]} />
                            <meshBasicMaterial 
                                color={data.atmosphere} 
                                transparent 
                                opacity={0.15}
                                blending={THREE.AdditiveBlending}
                            />
                        </mesh>
                    )}

                    {/* Anéis */}
                    {'rings' in data && data.rings && (
                        <PlanetRings 
                            innerRadius={data.rings.innerRadius}
                            outerRadius={data.rings.outerRadius}
                            color={data.rings.color}
                            opacity={data.rings.opacity}
                        />
                    )}
                </group>

                {/* Label */}
                {showLabels && (
                    <Html position={[0, data.radius + 0.4, 0]} center>
                        <div style={{
                            color: 'white',
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            textShadow: '0 0 8px rgba(0,0,0,0.9)',
                            whiteSpace: 'nowrap',
                            padding: '2px 6px',
                            background: isSelected ? 'rgba(255,255,255,0.15)' : 'transparent',
                            borderRadius: '4px',
                        }}>
                            {data.name}
                        </div>
                    </Html>
                )}
            </group>

            {/* Luas (renderizadas separadamente para orbitar corretamente) */}
            {data.moons.map((moon) => (
                <Moon 
                    key={moon.name}
                    data={moon}
                    parentRef={groupRef}
                    isPlaying={isPlaying}
                    speedMultiplier={speedMultiplier}
                />
            ))}
        </>
    )
}

// Cinturão de Asteroides melhorado
function AsteroidBelt({ isPlaying, speedMultiplier }: { isPlaying: boolean; speedMultiplier: number }) {
    const groupRef = useRef<THREE.Group>(null)
    
    const asteroids = useMemo(() => {
        const items = []
        for (let i = 0; i < 400; i++) {
            const angle = (i / 400) * Math.PI * 2 + Math.random() * 0.3
            const distance = 12.5 + Math.random() * 1.5
            const y = (Math.random() - 0.5) * 0.5
            items.push({
                position: [Math.cos(angle) * distance, y, Math.sin(angle) * distance] as [number, number, number],
                scale: 0.02 + Math.random() * 0.05,
            })
        }
        return items
    }, [])

    useFrame((_, delta) => {
        if (groupRef.current && isPlaying) {
            groupRef.current.rotation.y += delta * 0.008 * speedMultiplier
        }
    })

    return (
        <group ref={groupRef}>
            {asteroids.map((asteroid, i) => (
                <mesh key={i} position={asteroid.position} scale={asteroid.scale}>
                    <dodecahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial color="#8b7355" roughness={0.9} />
                </mesh>
            ))}
        </group>
    )
}

// Cinturão de Kuiper
function KuiperBelt({ isPlaying, speedMultiplier }: { isPlaying: boolean; speedMultiplier: number }) {
    const groupRef = useRef<THREE.Group>(null)
    
    const objects = useMemo(() => {
        const items = []
        for (let i = 0; i < 200; i++) {
            const angle = (i / 200) * Math.PI * 2
            const distance = 40 + Math.random() * 10
            items.push({
                position: [Math.cos(angle) * distance, (Math.random() - 0.5) * 2, Math.sin(angle) * distance] as [number, number, number],
                scale: 0.03 + Math.random() * 0.08,
                color: Math.random() > 0.7 ? '#add8e6' : '#a0a0a0'
            })
        }
        return items
    }, [])

    useFrame((_, delta) => {
        if (groupRef.current && isPlaying) {
            groupRef.current.rotation.y += delta * 0.002 * speedMultiplier
        }
    })

    return (
        <group ref={groupRef}>
            {objects.map((obj, i) => (
                <mesh key={i} position={obj.position} scale={obj.scale}>
                    <sphereGeometry args={[1, 8, 8]} />
                    <meshStandardMaterial color={obj.color} roughness={0.8} />
                </mesh>
            ))}
        </group>
    )
}

// Componente Principal
export function SolarSystemSimulator() {
    const [isPlaying, setIsPlaying] = useState(true)
    const [speedMultiplier, setSpeedMultiplier] = useState(1)
    const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null)
    const [showOrbits, setShowOrbits] = useState(true)
    const [showLabels, setShowLabels] = useState(true)

    const handleReset = () => {
        setIsPlaying(true)
        setSpeedMultiplier(1)
        setSelectedPlanet(null)
    }

    return (
        <div className="solar-sim">
            <style>{`
                .solar-sim {
                    width: 100vw;
                    height: 100vh;
                    background: #000005;
                    overflow: hidden;
                    position: relative;
                }
                .solar-sim .ui-overlay {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    padding: 0.6rem;
                    display: flex;
                    flex-direction: column;
                }
                .solar-sim .top-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    pointer-events: auto;
                }
                .solar-sim .left-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: white;
                }
                .solar-sim .icon-btn {
                    background: rgba(20,20,40,0.9);
                    border: 1px solid rgba(255,255,255,0.15);
                    border-radius: 0.4rem;
                    padding: 0.4rem;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                    transition: all 0.2s;
                }
                .solar-sim .icon-btn:hover {
                    background: rgba(100,100,200,0.3);
                    border-color: rgba(100,100,200,0.5);
                }
                .solar-sim .title {
                    font-size: 1.1rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #fdb813, #ff6b00);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .solar-sim .subtitle {
                    font-size: 0.55rem;
                    opacity: 0.5;
                }
                .solar-sim .right-info {
                    text-align: right;
                    color: white;
                }
                .solar-sim .prof-label {
                    font-size: 0.55rem;
                    opacity: 0.6;
                }
                .solar-sim .prof-name {
                    font-size: 0.75rem;
                    font-weight: 700;
                    background: linear-gradient(to right, #4488ff, #00ffff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .solar-sim .bottom-bar {
                    position: absolute;
                    bottom: 0.6rem;
                    left: 0.6rem;
                    right: 0.6rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    pointer-events: auto;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }
                .solar-sim .controls-box {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    background: rgba(10,10,30,0.95);
                    backdrop-filter: blur(10px);
                    padding: 0.5rem 0.6rem;
                    border-radius: 0.5rem;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .solar-sim .ctrl-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.4rem;
                    background: rgba(255,255,255,0.1);
                    border: none;
                    border-radius: 0.4rem;
                    color: white;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .solar-sim .ctrl-btn:hover {
                    background: rgba(255,255,255,0.2);
                }
                .solar-sim .ctrl-btn.active {
                    background: rgba(253,184,19,0.3);
                    border: 1px solid rgba(253,184,19,0.5);
                }
                .solar-sim .play-btn.playing {
                    background: rgba(239,68,68,0.4);
                }
                .solar-sim .play-btn.paused {
                    background: rgba(74,222,128,0.4);
                }
                .solar-sim .speed-ctrl {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                    color: white;
                    font-size: 0.65rem;
                }
                .solar-sim .speed-ctrl input {
                    width: 3.5rem;
                    accent-color: #fdb813;
                }
                .solar-sim .planets-nav {
                    position: absolute;
                    bottom: 4.5rem;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 0.25rem;
                    background: rgba(10,10,30,0.95);
                    backdrop-filter: blur(10px);
                    padding: 0.4rem;
                    border-radius: 0.5rem;
                    border: 1px solid rgba(255,255,255,0.1);
                    pointer-events: auto;
                    flex-wrap: wrap;
                    justify-content: center;
                    max-width: 95%;
                }
                .solar-sim .planet-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.1rem;
                    padding: 0.3rem 0.4rem;
                    background: transparent;
                    border: 1px solid transparent;
                    border-radius: 0.3rem;
                    color: white;
                    font-size: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .solar-sim .planet-btn:hover {
                    background: rgba(255,255,255,0.1);
                }
                .solar-sim .planet-btn.active {
                    background: rgba(253,184,19,0.2);
                    border-color: rgba(253,184,19,0.5);
                }
                .solar-sim .planet-dot {
                    width: 0.7rem;
                    height: 0.7rem;
                    border-radius: 50%;
                    box-shadow: 0 0 6px currentColor;
                }
                .solar-sim .info-panel {
                    position: absolute;
                    top: 50%;
                    right: 0.8rem;
                    transform: translateY(-50%);
                    background: rgba(10,10,30,0.98);
                    backdrop-filter: blur(15px);
                    border: 1px solid;
                    border-radius: 0.7rem;
                    padding: 0.9rem;
                    color: white;
                    width: 15rem;
                    pointer-events: auto;
                    box-shadow: 0 0 30px rgba(0,0,0,0.5);
                }
                .solar-sim .info-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.7rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .solar-sim .info-title {
                    font-size: 1rem;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .solar-sim .info-grid {
                    display: grid;
                    gap: 0.35rem;
                }
                .solar-sim .info-item {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.6rem;
                    padding: 0.25rem 0;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .solar-sim .info-label {
                    opacity: 0.6;
                }
                .solar-sim .info-value {
                    font-weight: 600;
                    text-align: right;
                }
                .solar-sim .info-fact {
                    margin-top: 0.6rem;
                    font-size: 0.65rem;
                    line-height: 1.4;
                    padding: 0.5rem;
                    background: linear-gradient(135deg, rgba(253,184,19,0.1), rgba(255,107,0,0.05));
                    border: 1px solid rgba(253,184,19,0.2);
                    border-radius: 0.4rem;
                }
                .solar-sim .tip {
                    color: rgba(255,255,255,0.4);
                    font-size: 0.55rem;
                    text-align: center;
                }
                .solar-sim .view-toggles {
                    display: flex;
                    gap: 0.3rem;
                }
                @media (max-width: 700px) {
                    .solar-sim .info-panel { 
                        top: auto;
                        bottom: 6rem;
                        right: 50%;
                        transform: translateX(50%);
                        width: 90%;
                        max-width: 18rem;
                    }
                    .solar-sim .planet-btn span { display: none; }
                }
            `}</style>

            <Canvas camera={{ position: [0, 25, 45], fov: 50 }}>
                <color attach="background" args={['#000005']} />
                <fog attach="fog" args={['#000005', 60, 120]} />
                <Suspense fallback={null}>
                    <Stars radius={200} depth={100} count={15000} factor={5} saturation={0.2} fade speed={0.3} />
                    
                    <ambientLight intensity={0.08} />
                    
                    <Sun />
                    
                    {PLANETS_DATA.map((planet) => (
                        <Planet
                            key={planet.name}
                            data={planet}
                            isPlaying={isPlaying}
                            speedMultiplier={speedMultiplier}
                            onSelect={() => setSelectedPlanet(planet)}
                            isSelected={selectedPlanet?.name === planet.name}
                            showOrbits={showOrbits}
                            showLabels={showLabels}
                        />
                    ))}

                    <AsteroidBelt isPlaying={isPlaying} speedMultiplier={speedMultiplier} />
                    <KuiperBelt isPlaying={isPlaying} speedMultiplier={speedMultiplier} />

                    <OrbitControls 
                        makeDefault 
                        enablePan 
                        enableZoom 
                        enableRotate 
                        minDistance={8} 
                        maxDistance={80}
                        maxPolarAngle={Math.PI * 0.85}
                        zoomSpeed={0.8}
                    />
                </Suspense>
            </Canvas>

            <div className="ui-overlay">
                <div className="top-bar">
                    <div className="left-header">
                        <Link to="/" className="icon-btn"><Home size={14} /></Link>
                        <div>
                            <div className="title">🌌 Sistema Solar</div>
                            <div className="subtitle">Astronomia Interativa 3D</div>
                        </div>
                    </div>
                    <div className="right-info">
                        <div className="prof-label">Aula Professora</div>
                        <div className="prof-name">Anayram Martins</div>
                    </div>
                </div>

                <div className="planets-nav">
                    <button 
                        className={`planet-btn ${!selectedPlanet ? 'active' : ''}`}
                        onClick={() => setSelectedPlanet(null)}
                    >
                        <div className="planet-dot" style={{ background: '#fdb813', boxShadow: '0 0 10px #fdb813' }} />
                        <span>Sol</span>
                    </button>
                    {PLANETS_DATA.map(planet => (
                        <button
                            key={planet.name}
                            className={`planet-btn ${selectedPlanet?.name === planet.name ? 'active' : ''}`}
                            onClick={() => setSelectedPlanet(planet)}
                        >
                            <div className="planet-dot" style={{ background: planet.color, boxShadow: `0 0 8px ${planet.color}` }} />
                            <span>{planet.name}</span>
                        </button>
                    ))}
                </div>

                <div className="bottom-bar">
                    <div className="controls-box">
                        <button 
                            className={`ctrl-btn play-btn ${isPlaying ? 'playing' : 'paused'}`}
                            onClick={() => setIsPlaying(!isPlaying)}
                        >
                            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                        </button>
                        <button className="ctrl-btn" onClick={handleReset}>
                            <RotateCcw size={14} />
                        </button>
                        <div className="speed-ctrl">
                            <span>⏱️</span>
                            <input 
                                type="range" 
                                min="0.1" 
                                max="5" 
                                step="0.1" 
                                value={speedMultiplier} 
                                onChange={e => setSpeedMultiplier(parseFloat(e.target.value))} 
                            />
                            <span>{speedMultiplier.toFixed(1)}x</span>
                        </div>
                    </div>

                    <div className="tip">🖱️ Arraste para girar • Scroll para zoom • Clique em um planeta</div>

                    <div className="view-toggles">
                        <button 
                            className={`ctrl-btn ${showOrbits ? 'active' : ''}`} 
                            onClick={() => setShowOrbits(!showOrbits)}
                            title="Mostrar órbitas"
                        >
                            <Eye size={14} />
                        </button>
                        <button 
                            className={`ctrl-btn ${showLabels ? 'active' : ''}`} 
                            onClick={() => setShowLabels(!showLabels)}
                            title="Mostrar nomes"
                        >
                            {showLabels ? 'Aa' : <EyeOff size={14} />}
                        </button>
                    </div>
                </div>

                {selectedPlanet && (
                    <div className="info-panel" style={{ borderColor: `${selectedPlanet.color}50` }}>
                        <div className="info-header">
                            <div className="info-title" style={{ color: selectedPlanet.color }}>
                                <div className="planet-dot" style={{ 
                                    background: selectedPlanet.color, 
                                    width: '1.2rem', 
                                    height: '1.2rem',
                                    boxShadow: `0 0 12px ${selectedPlanet.color}`
                                }} />
                                {selectedPlanet.name}
                            </div>
                            <button className="icon-btn" onClick={() => setSelectedPlanet(null)}>
                                <X size={12} />
                            </button>
                        </div>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">📏 Diâmetro</span>
                                <span className="info-value">{selectedPlanet.info.diameter}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">🌅 Duração do dia</span>
                                <span className="info-value">{selectedPlanet.info.dayLength}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">🌍 Duração do ano</span>
                                <span className="info-value">{selectedPlanet.info.yearLength}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">🌙 Luas</span>
                                <span className="info-value">{selectedPlanet.info.moonsCount}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">🌡️ Temperatura</span>
                                <span className="info-value">{selectedPlanet.info.temperature}</span>
                            </div>
                        </div>
                        <div className="info-fact">
                            {selectedPlanet.info.fact}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

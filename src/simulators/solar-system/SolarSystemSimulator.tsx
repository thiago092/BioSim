import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Html, useTexture } from '@react-three/drei'
import { Suspense, useState, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Home, Play, Pause, RotateCcw, Info, X, ZoomIn, ZoomOut } from 'lucide-react'
import * as THREE from 'three'

// Dados dos planetas (escala ajustada para visualização)
const PLANETS_DATA = [
    {
        name: 'Mercúrio',
        radius: 0.15,
        distance: 2.5,
        orbitSpeed: 4.15,
        rotationSpeed: 0.017,
        color: '#b5b5b5',
        info: {
            diameter: '4.879 km',
            dayLength: '59 dias terrestres',
            yearLength: '88 dias terrestres',
            moons: 0,
            temperature: '-180°C a 430°C',
            description: 'Menor planeta do Sistema Solar e mais próximo do Sol.'
        }
    },
    {
        name: 'Vênus',
        radius: 0.35,
        distance: 3.5,
        orbitSpeed: 1.62,
        rotationSpeed: -0.004,
        color: '#e6c87a',
        info: {
            diameter: '12.104 km',
            dayLength: '243 dias terrestres',
            yearLength: '225 dias terrestres',
            moons: 0,
            temperature: '465°C',
            description: 'Planeta mais quente, gira no sentido contrário.'
        }
    },
    {
        name: 'Terra',
        radius: 0.38,
        distance: 4.5,
        orbitSpeed: 1,
        rotationSpeed: 1,
        color: '#6b93d6',
        info: {
            diameter: '12.742 km',
            dayLength: '24 horas',
            yearLength: '365,25 dias',
            moons: 1,
            temperature: '-89°C a 57°C',
            description: 'Nosso planeta, único com vida conhecida.'
        }
    },
    {
        name: 'Marte',
        radius: 0.2,
        distance: 5.8,
        orbitSpeed: 0.53,
        rotationSpeed: 0.97,
        color: '#c1440e',
        info: {
            diameter: '6.779 km',
            dayLength: '24h 37min',
            yearLength: '687 dias terrestres',
            moons: 2,
            temperature: '-87°C a -5°C',
            description: 'Planeta vermelho, possui o maior vulcão do Sistema Solar.'
        }
    },
    {
        name: 'Júpiter',
        radius: 1.2,
        distance: 8,
        orbitSpeed: 0.084,
        rotationSpeed: 2.4,
        color: '#d4a574',
        info: {
            diameter: '139.820 km',
            dayLength: '10 horas',
            yearLength: '12 anos terrestres',
            moons: 95,
            temperature: '-145°C',
            description: 'Maior planeta, sua Grande Mancha Vermelha é uma tempestade gigante.'
        }
    },
    {
        name: 'Saturno',
        radius: 1,
        distance: 11,
        orbitSpeed: 0.034,
        rotationSpeed: 2.2,
        color: '#f4d59e',
        hasRings: true,
        info: {
            diameter: '116.460 km',
            dayLength: '10,7 horas',
            yearLength: '29 anos terrestres',
            moons: 146,
            temperature: '-178°C',
            description: 'Famoso por seus anéis de gelo e rocha.'
        }
    },
    {
        name: 'Urano',
        radius: 0.6,
        distance: 14,
        orbitSpeed: 0.012,
        rotationSpeed: -1.4,
        color: '#b5e3e3',
        info: {
            diameter: '50.724 km',
            dayLength: '17 horas',
            yearLength: '84 anos terrestres',
            moons: 28,
            temperature: '-224°C',
            description: 'Gira "deitado", seu eixo é quase horizontal.'
        }
    },
    {
        name: 'Netuno',
        radius: 0.55,
        distance: 17,
        orbitSpeed: 0.006,
        rotationSpeed: 1.5,
        color: '#5b7fde',
        info: {
            diameter: '49.244 km',
            dayLength: '16 horas',
            yearLength: '165 anos terrestres',
            moons: 16,
            temperature: '-218°C',
            description: 'Planeta mais ventoso, ventos chegam a 2.100 km/h.'
        }
    }
]

// Componente Sol
function Sun() {
    const meshRef = useRef<THREE.Mesh>(null)
    
    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.1
        }
    })

    return (
        <group>
            <mesh ref={meshRef}>
                <sphereGeometry args={[1.5, 64, 64]} />
                <meshBasicMaterial color="#fdb813" />
            </mesh>
            <pointLight position={[0, 0, 0]} intensity={2} color="#fdb813" distance={50} />
            <mesh>
                <sphereGeometry args={[1.7, 32, 32]} />
                <meshBasicMaterial color="#fdb813" transparent opacity={0.3} />
            </mesh>
            <mesh>
                <sphereGeometry args={[2, 32, 32]} />
                <meshBasicMaterial color="#ff6b00" transparent opacity={0.1} />
            </mesh>
        </group>
    )
}

// Componente Planeta
function Planet({ 
    data, 
    isPlaying, 
    speedMultiplier,
    onSelect,
    isSelected
}: { 
    data: typeof PLANETS_DATA[0]
    isPlaying: boolean
    speedMultiplier: number
    onSelect: () => void
    isSelected: boolean
}) {
    const meshRef = useRef<THREE.Mesh>(null)
    const orbitRef = useRef<THREE.Group>(null)
    const angleRef = useRef(Math.random() * Math.PI * 2)

    useFrame((_, delta) => {
        if (!isPlaying) return
        
        // Órbita
        angleRef.current += delta * data.orbitSpeed * 0.2 * speedMultiplier
        if (orbitRef.current) {
            orbitRef.current.position.x = Math.cos(angleRef.current) * data.distance
            orbitRef.current.position.z = Math.sin(angleRef.current) * data.distance
        }
        
        // Rotação própria
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * data.rotationSpeed * 0.5 * speedMultiplier
        }
    })

    return (
        <>
            {/* Órbita visual */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[data.distance - 0.02, data.distance + 0.02, 128]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.15} side={THREE.DoubleSide} />
            </mesh>

            {/* Planeta */}
            <group ref={orbitRef} position={[data.distance, 0, 0]}>
                <mesh 
                    ref={meshRef} 
                    onClick={onSelect}
                    onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' }}
                    onPointerOut={() => { document.body.style.cursor = 'default' }}
                >
                    <sphereGeometry args={[data.radius, 32, 32]} />
                    <meshStandardMaterial 
                        color={data.color} 
                        emissive={isSelected ? data.color : '#000000'}
                        emissiveIntensity={isSelected ? 0.3 : 0}
                    />
                </mesh>

                {/* Anéis de Saturno */}
                {data.hasRings && (
                    <mesh rotation={[Math.PI / 3, 0, 0]}>
                        <ringGeometry args={[data.radius * 1.4, data.radius * 2.2, 64]} />
                        <meshStandardMaterial 
                            color="#c9b896" 
                            transparent 
                            opacity={0.8} 
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                )}

                {/* Label */}
                <Html position={[0, data.radius + 0.3, 0]} center>
                    <div style={{
                        color: 'white',
                        fontSize: '0.6rem',
                        fontWeight: 600,
                        textShadow: '0 0 4px rgba(0,0,0,0.8)',
                        whiteSpace: 'nowrap',
                        opacity: 0.9
                    }}>
                        {data.name}
                    </div>
                </Html>
            </group>
        </>
    )
}

// Componente Cinturão de Asteroides
function AsteroidBelt({ isPlaying, speedMultiplier }: { isPlaying: boolean; speedMultiplier: number }) {
    const groupRef = useRef<THREE.Group>(null)
    
    const asteroids = useMemo(() => {
        const items = []
        for (let i = 0; i < 200; i++) {
            const angle = (i / 200) * Math.PI * 2
            const distance = 6.5 + Math.random() * 0.8
            items.push({
                position: [
                    Math.cos(angle) * distance,
                    (Math.random() - 0.5) * 0.3,
                    Math.sin(angle) * distance
                ] as [number, number, number],
                scale: 0.02 + Math.random() * 0.03
            })
        }
        return items
    }, [])

    useFrame((_, delta) => {
        if (groupRef.current && isPlaying) {
            groupRef.current.rotation.y += delta * 0.02 * speedMultiplier
        }
    })

    return (
        <group ref={groupRef}>
            {asteroids.map((asteroid, i) => (
                <mesh key={i} position={asteroid.position}>
                    <sphereGeometry args={[asteroid.scale, 8, 8]} />
                    <meshStandardMaterial color="#8b7355" />
                </mesh>
            ))}
        </group>
    )
}

// Componente Principal
export function SolarSystemSimulator() {
    const [isPlaying, setIsPlaying] = useState(true)
    const [speedMultiplier, setSpeedMultiplier] = useState(1)
    const [selectedPlanet, setSelectedPlanet] = useState<typeof PLANETS_DATA[0] | null>(null)
    const [showInfo, setShowInfo] = useState(false)
    const [cameraDistance, setCameraDistance] = useState(25)

    const handleReset = () => {
        setIsPlaying(true)
        setSpeedMultiplier(1)
        setSelectedPlanet(null)
        setCameraDistance(25)
    }

    return (
        <div className="solar-sim">
            <style>{`
                .solar-sim {
                    width: 100vw;
                    height: 100vh;
                    background: #000008;
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
                }
                .solar-sim .icon-btn:hover {
                    background: rgba(100,100,200,0.3);
                }
                .solar-sim .title {
                    font-size: 1rem;
                    font-weight: 700;
                    background: linear-gradient(to right, #fdb813, #ff6b00);
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
                    background: rgba(10,10,30,0.9);
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
                }
                .solar-sim .ctrl-btn:hover {
                    background: rgba(255,255,255,0.2);
                }
                .solar-sim .play-btn.playing {
                    background: rgba(239,68,68,0.3);
                }
                .solar-sim .play-btn.paused {
                    background: rgba(74,222,128,0.3);
                }
                .solar-sim .speed-ctrl {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                    color: white;
                    font-size: 0.65rem;
                }
                .solar-sim .speed-ctrl input {
                    width: 3rem;
                    accent-color: #fdb813;
                }
                .solar-sim .planets-nav {
                    position: absolute;
                    bottom: 4rem;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 0.3rem;
                    background: rgba(10,10,30,0.9);
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
                    gap: 0.15rem;
                    padding: 0.3rem 0.5rem;
                    background: transparent;
                    border: 1px solid transparent;
                    border-radius: 0.3rem;
                    color: white;
                    font-size: 0.55rem;
                    cursor: pointer;
                }
                .solar-sim .planet-btn:hover {
                    background: rgba(255,255,255,0.1);
                }
                .solar-sim .planet-btn.active {
                    background: rgba(253,184,19,0.2);
                    border-color: rgba(253,184,19,0.5);
                }
                .solar-sim .planet-dot {
                    width: 0.6rem;
                    height: 0.6rem;
                    border-radius: 50%;
                }
                .solar-sim .info-panel {
                    position: absolute;
                    top: 50%;
                    right: 1rem;
                    transform: translateY(-50%);
                    background: rgba(10,10,30,0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(253,184,19,0.3);
                    border-radius: 0.6rem;
                    padding: 0.8rem;
                    color: white;
                    max-width: 14rem;
                    pointer-events: auto;
                }
                .solar-sim .info-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.6rem;
                }
                .solar-sim .info-title {
                    font-size: 0.9rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }
                .solar-sim .info-grid {
                    display: grid;
                    gap: 0.4rem;
                }
                .solar-sim .info-item {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.6rem;
                    padding: 0.3rem 0;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .solar-sim .info-label {
                    opacity: 0.6;
                }
                .solar-sim .info-value {
                    font-weight: 600;
                    text-align: right;
                }
                .solar-sim .info-desc {
                    margin-top: 0.5rem;
                    font-size: 0.6rem;
                    line-height: 1.4;
                    opacity: 0.8;
                    padding: 0.4rem;
                    background: rgba(255,255,255,0.05);
                    border-radius: 0.3rem;
                }
                .solar-sim .tip {
                    color: rgba(255,255,255,0.4);
                    font-size: 0.55rem;
                    text-align: center;
                }
                .solar-sim .zoom-btns {
                    display: flex;
                    flex-direction: column;
                    gap: 0.3rem;
                }
                @media (max-width: 600px) {
                    .solar-sim .info-panel { display: none; }
                    .solar-sim .planet-btn span { display: none; }
                }
            `}</style>

            <Canvas camera={{ position: [0, 15, cameraDistance], fov: 50 }}>
                <color attach="background" args={['#000008']} />
                <Suspense fallback={null}>
                    <Stars radius={300} depth={100} count={8000} factor={4} saturation={0} fade speed={0.5} />
                    
                    <ambientLight intensity={0.1} />
                    
                    <Sun />
                    
                    {PLANETS_DATA.map((planet) => (
                        <Planet
                            key={planet.name}
                            data={planet}
                            isPlaying={isPlaying}
                            speedMultiplier={speedMultiplier}
                            onSelect={() => setSelectedPlanet(planet)}
                            isSelected={selectedPlanet?.name === planet.name}
                        />
                    ))}

                    <AsteroidBelt isPlaying={isPlaying} speedMultiplier={speedMultiplier} />

                    <OrbitControls 
                        makeDefault 
                        enablePan 
                        enableZoom 
                        enableRotate 
                        minDistance={5} 
                        maxDistance={60}
                        maxPolarAngle={Math.PI / 1.5}
                    />
                </Suspense>
            </Canvas>

            <div className="ui-overlay">
                <div className="top-bar">
                    <div className="left-header">
                        <Link to="/" className="icon-btn"><Home size={14} /></Link>
                        <div>
                            <div className="title">🌌 Sistema Solar</div>
                            <div className="subtitle">Astronomia Interativa</div>
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
                        <div className="planet-dot" style={{ background: '#fdb813' }} />
                        <span>Sol</span>
                    </button>
                    {PLANETS_DATA.map(planet => (
                        <button
                            key={planet.name}
                            className={`planet-btn ${selectedPlanet?.name === planet.name ? 'active' : ''}`}
                            onClick={() => setSelectedPlanet(planet)}
                        >
                            <div className="planet-dot" style={{ background: planet.color }} />
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
                            <span>Vel:</span>
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

                    <div className="tip">💡 Arraste para girar • Scroll para zoom • Clique em um planeta</div>

                    <div className="zoom-btns">
                        <button className="icon-btn" onClick={() => setShowInfo(!showInfo)}>
                            <Info size={14} />
                        </button>
                    </div>
                </div>

                {selectedPlanet && (
                    <div className="info-panel">
                        <div className="info-header">
                            <div className="info-title">
                                <div className="planet-dot" style={{ background: selectedPlanet.color, width: '1rem', height: '1rem' }} />
                                {selectedPlanet.name}
                            </div>
                            <button className="icon-btn" onClick={() => setSelectedPlanet(null)}>
                                <X size={12} />
                            </button>
                        </div>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Diâmetro</span>
                                <span className="info-value">{selectedPlanet.info.diameter}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Duração do dia</span>
                                <span className="info-value">{selectedPlanet.info.dayLength}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Duração do ano</span>
                                <span className="info-value">{selectedPlanet.info.yearLength}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Luas</span>
                                <span className="info-value">{selectedPlanet.info.moons}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Temperatura</span>
                                <span className="info-value">{selectedPlanet.info.temperature}</span>
                            </div>
                        </div>
                        <div className="info-desc">
                            {selectedPlanet.info.description}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

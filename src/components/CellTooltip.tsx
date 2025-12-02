import type { Phase } from '../types'

interface CellTooltipProps {
    phase: Phase
    position: [number, number]
    cellIndex: number
    elapsedTime: number
}

function CellPreview2D({ phase }: { phase: Phase }) {
    const membraneColor = "#4488ff"
    const nucleusColor = "#ffaa00"
    const chromosomeColor = "#ff00ff"

    const isInterphase = phase.includes('Intérfase') || phase.includes('G1') || phase.includes('S') || phase.includes('G2')
    const isProphase = phase.includes('Prófase')
    const isMetaphase = phase.includes('Metáfase') || phase.includes('Prometáfase')
    const isAnaphase = phase.includes('Anáfase')
    const isTelophase = phase.includes('Telófase')
    const isCytokinesis = phase.includes('Citocinese')

    return (
        <svg width="100" height="100" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 5px rgba(68, 136, 255, 0.5))' }}>
            <defs>
                <radialGradient id="cellGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor={membraneColor} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={membraneColor} stopOpacity="0.1" />
                </radialGradient>
            </defs>

            {/* Membrana Base */}
            {!isCytokinesis && !isTelophase && (
                <circle cx="50" cy="50" r="45" fill="url(#cellGrad)" stroke={membraneColor} strokeWidth="2" />
            )}

            {/* Intérfase: Núcleo e Cromatina */}
            {isInterphase && (
                <>
                    <circle cx="50" cy="50" r="20" fill={nucleusColor} fillOpacity="0.4" stroke={nucleusColor} strokeWidth="1" />
                    {phase.includes('S') && (
                        <circle cx="50" cy="50" r="25" fill="none" stroke={chromosomeColor} strokeWidth="1" strokeDasharray="3 3" opacity="0.7">
                            <animate attributeName="stroke-dashoffset" from="0" to="6" dur="1s" repeatCount="indefinite" />
                        </circle>
                    )}
                </>
            )}

            {/* Prófase: Cromossomos Condensando */}
            {isProphase && (
                <g stroke={chromosomeColor} strokeWidth="3" strokeLinecap="round">
                    <path d="M 40 40 L 50 50 M 50 40 L 40 50" />
                    <path d="M 60 60 L 50 50 M 50 60 L 60 50" />
                    <path d="M 60 40 L 50 50 M 50 40 L 60 50" />
                    <path d="M 40 60 L 50 50 M 50 60 L 40 50" />
                </g>
            )}

            {/* Metáfase: Alinhamento */}
            {isMetaphase && (
                <g stroke={chromosomeColor} strokeWidth="3" strokeLinecap="round">
                    <line x1="50" y1="20" x2="50" y2="35" />
                    <line x1="45" y1="27" x2="55" y2="27" />

                    <line x1="50" y1="42" x2="50" y2="57" />
                    <line x1="45" y1="50" x2="55" y2="50" />

                    <line x1="50" y1="65" x2="50" y2="80" />
                    <line x1="45" y1="72" x2="55" y2="72" />

                    {/* Fuso */}
                    <line x1="10" y1="50" x2="90" y2="50" stroke="white" strokeWidth="0.5" opacity="0.5" />
                </g>
            )}

            {/* Anáfase: Separação */}
            {isAnaphase && (
                <g stroke={chromosomeColor} strokeWidth="3" strokeLinecap="round" fill="none">
                    <path d="M 30 20 Q 25 27 30 35" />
                    <path d="M 30 42 Q 25 50 30 57" />
                    <path d="M 30 65 Q 25 72 30 80" />

                    <path d="M 70 20 Q 75 27 70 35" />
                    <path d="M 70 42 Q 75 50 70 57" />
                    <path d="M 70 65 Q 75 72 70 80" />
                </g>
            )}

            {/* Telófase: Dois Núcleos */}
            {isTelophase && (
                <>
                    <ellipse cx="50" cy="50" rx="45" ry="35" fill="url(#cellGrad)" stroke={membraneColor} strokeWidth="2" />
                    <circle cx="30" cy="50" r="15" fill={nucleusColor} fillOpacity="0.4" />
                    <circle cx="70" cy="50" r="15" fill={nucleusColor} fillOpacity="0.4" />
                </>
            )}

            {/* Citocinese: Estrangulamento */}
            {isCytokinesis && (
                <>
                    <path d="M 25 50 A 20 20 0 1 0 25 51" fill="url(#cellGrad)" stroke={membraneColor} strokeWidth="2" transform="translate(-10,0)" />
                    <path d="M 75 50 A 20 20 0 1 0 75 51" fill="url(#cellGrad)" stroke={membraneColor} strokeWidth="2" transform="translate(10,0)" />
                </>
            )}
        </svg>
    )
}

export function CellTooltip({ phase, position, cellIndex, elapsedTime }: CellTooltipProps) {
    const [x, y] = position

    // Mapeia fase para descrição
    const getPhaseDescription = (phase: Phase): string => {
        const descriptions: Partial<Record<Phase, string>> = {
            'Intérfase': 'Célula em crescimento, DNA sendo replicado',
            'Intérfase-G1': 'Crescimento celular, síntese de proteínas',
            'Intérfase-S': 'Replicação do DNA em andamento',
            'Intérfase-G2': 'Preparação para divisão',
            'Prófase': 'Cromossomos condensando',
            'Prófase-Inicial': 'Início da condensação',
            'Prófase-Tardia': 'Cromossomos visíveis',
            'Prometáfase': 'Envelope nuclear se desfazendo',
            'Metáfase': 'Cromossomos alinhados no centro',
            'Anáfase': 'Cromossomos se separando',
            'Anáfase-A': 'Cromátides irmãs se separando',
            'Anáfase-B': 'Polos celulares se afastando',
            'Telófase': 'Novos núcleos se formando',
            'Citocinese': 'Divisão do citoplasma',
            'Células-Filhas': 'Divisão completa'
        }
        return descriptions[phase] || 'Em divisão celular'
    }

    const getNextPhase = (phase: Phase): string => {
        const nextPhases: Partial<Record<Phase, string>> = {
            'Intérfase': 'Prófase',
            'Intérfase-G1': 'Fase S',
            'Intérfase-S': 'Fase G2',
            'Intérfase-G2': 'Prófase',
            'Prófase': 'Metáfase',
            'Prófase-Inicial': 'Prófase Tardia',
            'Prófase-Tardia': 'Prometáfase',
            'Prometáfase': 'Metáfase',
            'Metáfase': 'Anáfase',
            'Anáfase': 'Telófase',
            'Anáfase-A': 'Anáfase B',
            'Anáfase-B': 'Telófase',
            'Telófase': 'Citocinese',
            'Citocinese': 'Células-Filhas',
            'Células-Filhas': 'Nova Intérfase'
        }
        return nextPhases[phase] || 'Próxima fase'
    }

    return (
        <div style={{
            position: 'fixed',
            left: `${x}px`,
            top: `${y}px`,
            transform: 'translate(-50%, -120%)',
            background: 'rgba(10, 10, 30, 0.95)',
            backdropFilter: 'blur(15px)',
            border: '2px solid rgba(100, 200, 255, 0.6)',
            borderRadius: '16px',
            padding: '16px 20px',
            minWidth: '280px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(100, 200, 255, 0.3)',
            pointerEvents: 'none',
            zIndex: 10000,
            animation: 'tooltipFadeIn 0.3s ease-out',
        }}>
            {/* Título */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '12px',
            }}>
                <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4488ff, #00ffff)',
                    boxShadow: '0 0 10px rgba(68, 136, 255, 0.8)',
                    animation: 'pulse 2s infinite',
                }} />
                <span style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.7)',
                }}>
                    Célula #{cellIndex + 1}
                </span>
            </div>

            {/* Fase atual */}
            <div style={{
                marginBottom: '10px',
            }}>
                <div style={{
                    fontSize: '1.3rem',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #4488ff, #00ffff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '4px',
                }}>
                    {phase}
                </div>
                <div style={{
                    fontSize: '0.85rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.4,
                }}>
                    {getPhaseDescription(phase)}
                </div>
            </div>

            {/* Visualização 2D (Raio-X) */}
            <div style={{
                width: '100%',
                height: '120px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden'
            }}>
                <CellPreview2D phase={phase} />
            </div>

            {/* Tempo */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: 'rgba(68, 136, 255, 0.1)',
                borderRadius: '8px',
                marginBottom: '10px',
            }}>
                <span style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                }}>
                    Tempo na fase
                </span>
                <span style={{
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: '#00ffff',
                }}>
                    {elapsedTime.toFixed(1)}s
                </span>
            </div>

            {/* Próxima fase */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                color: 'rgba(255, 255, 255, 0.6)',
            }}>
                <span>Próximo:</span>
                <span style={{
                    fontWeight: '600',
                    color: '#00ff88',
                }}>
                    {getNextPhase(phase)}
                </span>
            </div>

            {/* Seta apontando para célula */}
            <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0',
                height: '0',
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid rgba(100, 200, 255, 0.6)',
            }} />

            <style>{`
                @keyframes tooltipFadeIn {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -110%) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -120%) scale(1);
                    }
                }

                @keyframes pulse {
                    0%, 100% { opacity: 0.6; transform: scale(0.9); }
                    50% { opacity: 1; transform: scale(1.1); }
                }
            `}</style>
        </div>
    )
}
